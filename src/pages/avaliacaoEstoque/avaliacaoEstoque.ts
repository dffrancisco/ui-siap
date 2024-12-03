import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceAvaliacaoEstoque from './services/avaliacaoEstoque.service';
import { iParamsRelatorio, iResponseRelatorio, iDadosAvaliacao } from './interfaces';
import utils, { iColumnPrint } from '@/ts/utils';
import { mesesToSelect } from "@/constants/constants";

export const meses = mesesToSelect;
const ano = moment().year();
const mes = moment().month() + 1;


export const state = reactive({
    loading: false,
    mes: mes,
    ano: ano || "",
    dadosRelatorio: <iDadosAvaliacao[]>[],
    totalItems: 0,
    itemsPerPage: 10,
    page: 1,
    headers: <any>[
        { title: "Nome do Avaliador", key: "AVALIADOR", sortable: true, align: "left" },
        { title: "Nome do Estoquista", key: "AVALIADO", sortable: true, align: "left" },

        {
            title: "Data Avaliação", key: "DT_AVALIACAO", sortable: true, align: "left",
            value: (item: iDadosAvaliacao) => moment(item.DT_AVALIACAO).format("DD/MM/YYYY HH:mm:ss")
        },
        { title: "Pontuação", key: "NT_PONTUACAO", sortable: true, align: "center" },
        { title: "Situação", key: "ST_SITUACAO", sortable: true, align: "left" },
        { title: "Cor Corredor", key: "COR_CORREDOR", sortable: true, align: "left" },
    ],
});

export const actions = {

    async init() {
        actions.validarFiltros();
    },

    validarFiltros() {
        const { ano, mes } = state;


        if (!ano || ano > ano) {
            Swal.fire({
                icon: "warning",
                text: "Insira um ano válido para continuar"
            });
            return;
        }


        if (!mes || (ano === ano && mes > mes)) {
            Swal.fire({
                icon: "warning",
                text: "Insira um mês válido para continuar"
            });
            return;
        }


        actions.getDadosRelatorio();
    },

    async getDadosRelatorio() {
        try {
            state.loading = true;

            const params: iParamsRelatorio = {
                mes: state.mes,
                ano: state.ano,
                page: state.page,
                itemsPerPage: state.itemsPerPage,
            };

            const response: iResponseRelatorio = await serviceAvaliacaoEstoque.getDadosParaRelatorio(params);
            state.dadosRelatorio = response.dadosRelatorio || [];
            state.totalItems = response.totalDadosRelatorio?.[0]?.TOTAL || 0;

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
            state.loading = false;
        }
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
                { key: 'ID_AVALIACAO', label: 'ID Avaliação', width: '10%', align: 'left' },
                { key: 'DT_AVALIACAO', label: 'Data Avaliação', width: '15%', align: 'left' },
                { key: 'COR_CORREDOR', label: 'Cor Corredor', width: '10%', align: 'left' },
                { key: 'NT_PONTUACAO', label: 'Pontuação', width: '10%', align: 'left' },
                { key: 'AVALIADO', label: 'Avaliado', width: '15%', align: 'left' },
                { key: 'AVALIADOR', label: 'Avaliador', width: '15%', align: 'left' },
                { key: 'ST_SITUACAO', label: 'Situação', width: '15%', align: 'left' },
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

    formatarDadosImpressao(data: iDadosAvaliacao[]) {
        return data.map(item => ({
            ...item,
            DT_AVALIACAO: item.DT_AVALIACAO ? utils.dataBrasil(item.DT_AVALIACAO) : '-------',
        }));
    },

    getClassCorLinha(dados: iDadosAvaliacao) {
        return { class: dados.ID_AVALIACAO % 2 === 0 ? 'cor-zebrada-1' : 'cor-zebrada-2' };
    },
};