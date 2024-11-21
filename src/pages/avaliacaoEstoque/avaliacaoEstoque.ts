import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceRelatorioCurvaAbc from './services/avaliacaoEstoque.service';
import { iParams, iResponseRelatorio, iDadosAvaliacao } from './interfaces';
import utils, { iColumnPrint } from '@/ts/utils';

export const state = reactive({
    loading: false,
    mesSelecionado: '',
    ano: '',
    dadosRelatorio: [] as iDadosAvaliacao[],
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,

    headers: [
        { title: "ID Avaliação", key: "ID_AVALIACAO", sortable: true, align: "left" },
        {
            title: "Data Avaliação",
            key: "DT_AVALIACAO",
            sortable: true,
            align: "left",
            value: (item: iDadosAvaliacao) => moment(item.DT_AVALIACAO).format("DD/MM/YYYY HH:mm:ss"),
        },
        { title: "Cor Corredor", key: "COR_CORREDOR", sortable: true, align: "left" },
        { title: "Pontuação", key: "NT_PONTUACAO", sortable: true, align: "left" },
        { title: "Avaliado", key: "AVALIADO", sortable: true, align: "left" },
        { title: "Avaliador", key: "AVALIADOR", sortable: true, align: "left" },
        { title: "Situação", key: "ST_SITUACAO", sortable: true, align: "left" },
    ],
});

export const actions = {
    async init() {
        await actions.getAvaliacao();
    },

    async getAvaliacao() {
        try {
            state.loading = true;
            const params: iParams = {
                id_sociedade: '',
                ax: 'getAvaliacoes',
                mes: Number(state.mesSelecionado),
                ano: Number(state.ano),
            };

            const data: iResponseRelatorio = await serviceRelatorioCurvaAbc.getAvaliacao(params);
            state.dadosRelatorio = data.dadosRelatorio;
            state.totalItems = data.totalDadosRelatorio[0]?.TOTAL || 0;

        } catch (error) {
            console.error("Erro ao buscar as avaliações", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar avaliações.',
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        try {
            state.loading = true;


            const relatorio = state.dadosRelatorio;
            const relatorioAjustado = actions.formatarDadosImpressao([...relatorio]);


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
                <div style="display: flex; justify-content: center; width: 100%; margin-top: 10px">
                    <span>&nbsp;</span>
                    <strong style="font-size: 16px;">Relatório de Avaliação de Estoque</strong>
                </div>
            `;


            await utils.printComCabecalho(columns, relatorioAjustado, titulo);

        } catch (error) {
            console.error("Erro ao imprimir o relatório", error);
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        } finally {
            state.loading = false;
        }
    },


    formatarDadosImpressao(data: iDadosAvaliacao[]) {
        return data.map(item => ({
            ...item,
            DT_AVALIACAO: item.DT_AVALIACAO ? moment(item.DT_AVALIACAO).format('DD/MM/YYYY HH:mm:ss') : '----',
        }));
    },

    getClassCorLinha(dados: iDadosAvaliacao) {
        return { class: dados.ID_AVALIACAO % 2 === 0 ? 'cor-zebrada-1' : 'cor-zebrada-2' };
    },

    updatePage(page: number) {
        if (page > 0 && page <= Math.ceil(state.totalItems / state.itemsPerPage)) {
            state.page = page;
            actions.getAvaliacao();
        }
    },
};
