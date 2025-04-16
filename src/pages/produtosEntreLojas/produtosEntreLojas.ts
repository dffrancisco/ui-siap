import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceProdutosEntreLojas from './services/produtosEntreLojas.service';
import {
    iLojas, ParamsLojas, iDadosLojas, iResponseRelatorio,
} from './interfaces';
import utils, { iColumnPrint } from '@/ts/utils';
import { mesesToSelect } from "@/constants/constants";


export const meses = mesesToSelect;
const ano = moment().year();
const mes = moment().month() + 1;

export const state = reactive({
    loading: false,
    mes: mes,
    cnpj: '',
    ano: ano || null,
    selectedLoja: null as iLojas | null,
    lojas: <iLojas[]>[],
    dadosRelatorio: <iDadosLojas[]>[],

    headers: <any>[
        { title: "Lojas", key: "lojas", sortable: true, align: "left" },
        { title: "Valores", key: "valores", sortable: true, align: "left" },
    ],
});

export const actions = {

    async init() {
        await actions.getDadosIniciais();
        actions.validarFiltros();

    },

    async getDadosIniciais() {
        state.loading = true;
        try {

            state.lojas = await serviceProdutosEntreLojas.getLojas();

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar lojas!"
            });
        } finally {
            state.loading = false;
        }
    },

    async getDadosRelatorio() {
        try {
            state.loading = true;

            const params: ParamsLojas = {
                cnpj: state.cnpj,
                mes: state.mes,
                ano: state.ano,

            };


            const response: iResponseRelatorio = await serviceProdutosEntreLojas.getDadosParaRelatorio(params);
            state.dadosRelatorio = response.dadosRelatorio || [];


            if (!state.dadosRelatorio) {
                Swal.fire({
                    icon: "warning",
                    text: "Nenhum dado foi retornado para os filtros aplicados.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "warning",
                title: "Erro",
                text: "Nenhum dado disponível para relatorio",
            });
        } finally {
            setTimeout(() => { state.loading = false; }, 200)

        }
    },

    validarFiltros() {

    },

    async onClickImprimir() {
        try {
            if (!state.dadosRelatorio || state.dadosRelatorio.length === 0) {
                Swal.fire({ icon: "warning", text: "Nenhum dado disponível para impressão." });
                return;
            }

            state.loading = true;
            const relatorioAjustado = actions.formatarDadosImpressao(state.dadosRelatorio);

            const columns: iColumnPrint[] = [
                { key: 'valores', label: 'Valores', width: '15%', align: 'left' },
                { key: 'lojas', label: 'Lojas', width: '10%', align: 'left' },
            ];

            const titulo = `
                <div style="text-align: center; margin-top: 10px;">
                    <strong style="font-size: 16px;">Relatório de Avaliação de Estoque</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo);
        } catch (error) {
            console.error("Erro ao imprimir o relatório:", error);
            Swal.fire({ icon: "error", text: "Erro ao imprimir o relatório." });
        } finally {
            state.loading = false;
        }
    },

    formatarDadosImpressao(data: any[]) {
        return data.map(item => ({
            ...item,
            DT_AVALIACAO: item.DT_AVALIACAO ? utils.dataBrasil(item.DT_AVALIACAO) : '-------',
        }));
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 === 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },

};
