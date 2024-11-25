import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceRelatorioCurvaAbc from './services/avaliacaoEstoque.service';
import { iParams, iResponseRelatorio, iDadosAvaliacao } from './interfaces';
import utils, { iColumnPrint } from '@/ts/utils';

const anoAtual = moment().year();
const mesAtual = moment().month() + 1;

export const state = reactive({
    loading: false,
    mesSelecionado: mesAtual,
    anoSelecionado: anoAtual,
    meses: [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' },
    ],
    dadosRelatorio: <iDadosAvaliacao[]>[],
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    headers: <any>[
        {
            title: "ID Avaliação",
            key: "ID_AVALIACAO",
            sortable: true,
            align: "left",
        },
        {
            title: "Data Avaliação",
            key: "DT_AVALIACAO",
            sortable: true,
            align: "left",
            value: (item: iDadosAvaliacao) => moment(item.DT_AVALIACAO).format("DD/MM/YYYY HH:mm:ss"),
        },
        {
            title: "Cor Corredor",
            key: "COR_CORREDOR",
            sortable: true,
            align: "left",
        },
        {
            title: "Pontuação",
            key: "NT_PONTUACAO",
            sortable: true,
            align: "left",
        },
        {
            title: "Avaliado",
            key: "AVALIADO",
            sortable: true,
            align: "left",
        },
        {
            title: "Avaliador",
            key: "AVALIADOR",
            sortable: true,
            align: "left",
        },
        {
            title: "Situação",
            key: "ST_SITUACAO",
            sortable: true,
            align: "left",
        },
    ],
});

export const actions = {
    async init() {
        actions.validarFiltros();
    },

    validarFiltros() {
        const { anoSelecionado, mesSelecionado } = state;

        if (!anoSelecionado || anoSelecionado > anoAtual) {
            Swal.fire({
                icon: "warning",
                text: "Insira um ano válido para continuar.",
            });
            return;
        }

        if (!mesSelecionado || mesSelecionado < 1 || mesSelecionado > 12 || (anoSelecionado === anoAtual && mesSelecionado > mesAtual)) {
            Swal.fire({
                icon: "warning",
                text: "Insira um mês válido para continuar.",
            });
            return;
        }

        actions.getDadosRelatorio();
    },

    async getDadosRelatorio() {
        try {
            state.loading = true;

            const params: iParams = {
                mes: state.mesSelecionado,
                ano: state.anoSelecionado,
                page: state.page,
                itemsPerPage: state.itemsPerPage,
                id_sociedade: '',
                ax: '',
            };

            const data: iResponseRelatorio = await serviceRelatorioCurvaAbc.getDadosParaRelatorio(params);

            state.dadosRelatorio = data.dadosRelatorio || [];
            state.totalItems = data.totalDadosRelatorio?.[0]?.TOTAL || 0;

            if (!state.dadosRelatorio.length) {
                Swal.fire({
                    icon: "info",
                    text: "Nenhum dado encontrado.",
                });
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar dados do relatório.",
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        try {
            if (!state.dadosRelatorio.length) {
                Swal.fire({
                    icon: "warning",
                    text: "Nenhum dado disponível para impressão.",
                });
                return;
            }

            state.loading = true;

            const relatorioAjustado = actions.formatarDadosImpressao([...state.dadosRelatorio]);

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
                    <strong style="font-size: 16px;">Relatório de Avaliação de Estoque</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo);
        } catch (error) {
            console.error("Erro ao imprimir o relatório:", error);
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório.",
            });
        } finally {
            state.loading = false;
        }
    },

    formatarDadosImpressao(data: iDadosAvaliacao[]) {
        return data.map(item => ({
            ...item,
            DT_AVALIACAO: item.DT_AVALIACAO
                ? moment(item.DT_AVALIACAO).format('DD/MM/YYYY HH:mm:ss')
                : '----',
        }));
    },

    updatePage(newPage: number) {
        state.page = newPage;
        actions.getDadosRelatorio();
    },

    getClassCorLinha(dados: iDadosAvaliacao) {
        const classe = dados.ID_AVALIACAO % 2 === 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};
