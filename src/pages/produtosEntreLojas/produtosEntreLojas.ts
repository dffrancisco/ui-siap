import { reactive, computed } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceProdutosEntreLojas from './services/produtosEntreLojas.service';
import {
    iLojas, ParamsLojas, iDadosLojas, iResponseRelatorio,
} from './interfaces';
import utils, { dataBrasil, formatValor, iColumnPrint } from '@/ts/utils';
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
        { title: "Lojas", key: "NOME", sortable: true, align: "left" },
        {
            title: "Valores",
            key: "VLR",
            sortable: true,
            align: "left",
            value: (item: iDadosLojas) => formatValor(item.VLR),
            width: "20%"
        },
    ],
});

export const totalGeral = computed(() => {
    return state.dadosRelatorio.reduce((acc, item) => acc + Number(item.VLR || 0), 0).toFixed(2);
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
                cnpj: state.selectedLoja ? state.selectedLoja.CGC_CLIENTE : '',
                mes: state.mes,
                ano: state.ano,
            };

            const response: iResponseRelatorio = await serviceProdutosEntreLojas.getDadosParaRelatorio(params);


            state.dadosRelatorio = response.dadosRelatorio || [];

            if (!state.dadosRelatorio.length) {
                Swal.fire({
                    icon: "warning",
                    text: "Nenhum dado foi retornado para os filtros aplicados."
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "warning",
                title: "Erro",
                text: "Nenhum dado disponível para relatório"
            });
        } finally {
            state.loading = false;;
        }
    },
    validarFiltros() {


        state.cnpj = state.selectedLoja.CGC_CLIENTE;

        actions.getDadosRelatorio();
    },


    async onClickImprimir() {
        try {
            if (!state.dadosRelatorio || state.dadosRelatorio.length === 0) {
                Swal.fire({ icon: "warning", text: "Nenhum dado disponível para impressão." });
                return;
            }

            state.loading = true;
            let relatorio = state.dadosRelatorio

            const relatorioFormatado = actions.formatarDadosImpressao([...relatorio])

            const columns: iColumnPrint[] = [
                { key: 'NOME', label: 'Lojas', width: '10%', align: 'left' },
                { key: 'VLR', label: 'Valores', width: '15%', align: 'left' },
            ];

            const total = totalGeral.value;
            relatorioFormatado.push({
                NOME: 'Total Geral:',
                VLR: total,
            });

            const titulo = `
                <div style="text-align: center; margin-top: 10px;">
                    <strong style="font-size: 16px;">Relatório de Avaliação de Estoque</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioFormatado, titulo);
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
            VLR: item.VLR ? utils.formatValor(item.VLR) : '-----',
        }));
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 === 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },

};
