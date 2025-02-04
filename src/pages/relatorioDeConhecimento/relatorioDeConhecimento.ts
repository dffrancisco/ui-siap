import { reactive, computed } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceRelatorioConhecimento from './services/relatorioDeConhecimento.service';
import { iTransportadora, iRelatorioConhecimento } from './interfaces';
import utils, { iColumnPrint, dataBrasil } from '@/ts/utils';

export const state = reactive({
    loading: false,
    transportadora: [] as any[],
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    dadosRelatorio: [] as iRelatorioConhecimento[],
    totalItems: 0,
    page: 1,
    transportadoras: [] as any[],
    ordenacao: 'dataConhecimento',
    ordenacaoOptions:
        <any>[
            { value: 'dataConhecimento', label: 'Data' },
            { value: 'nomeFantasia', label: 'Nome' },
            { value: 'numConhecimento', label: 'Nº Conhecimento' },
            { value: 'numNota', label: 'Nº Nota Fiscal' },
        ],

    itemsPerPage: 10,
    headers: <any>[
        { key: 'NOME_FANTAZIA', title: 'Nome', sortable: true, align: 'left' },
        { key: 'NUM_NOTA', title: 'Nº Nota', sortable: true, align: 'center' },
        { key: 'NUM_CONHECIMENTO', title: 'Nº Conhecimento', sortable: true, align: 'center' },
        { key: 'DATA_CONHECIMENTO', title: 'Data Conhecimento', sortable: true, align: 'center', value: (item: iRelatorioConhecimento) => dataBrasil(item.DATA_CONHECIMENTO) },
        { key: 'TOTAL_FATURA', title: 'Total Fatura', sortable: true, align: 'right' },
        { key: 'PERCENTUAL', title: '%', sortable: true, align: 'right' },
        { key: 'PAGAMENTO', title: 'Pagar', sortable: true, align: 'right', value: (item: iRelatorioConhecimento) => utils.formatValor(item.PAGAMENTO) },
    ],
});

export const totalPagamento = computed(() => {
    return state.dadosRelatorio.reduce((acc, item) => acc + (item.PAGAMENTO || 0), 0);
});

export const actions = {
    async init() {

        await actions.getTransportadoras();
    },

    validarInputs(): boolean {
        if (!state.transportadora) {
            Swal.fire({
                icon: 'warning',
                text: 'Selecione uma transportadora para realizar o filtro',
            });
            return false;
        }

        if (!state.dataInicio || !state.dataFim) {
            Swal.fire({
                icon: 'warning',
                text: 'Selecione um intervalo de datas adequado.',
            });
            return false;
        }

        if (moment(state.dataInicio).isAfter(moment(state.dataFim))) {
            Swal.fire({
                icon: 'warning',
                text: 'Adata inicial não pode ser menor que a data final.',
            });
            return false;
        }
        return true;
    },

    async buscarDadosComValidacao() {
        if (!actions.validarInputs()) {
            return;
        }
        await actions.getDadosParaRelatorio();
    },

    async getTransportadoras() {
        try {
            state.loading = true;

            const data = await serviceRelatorioConhecimento.getTransportadoras();
            state.transportadora = data.map((transportadora: iTransportadora) => ({
                value: transportadora.ID_TRANSPORTADORA,
                label: transportadora.RAZAO_SOCIAL,
            }));
            state.transportadoras = [];
        } catch (error) {
            console.error("Erro ao buscar transportadoras:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar transportadoras.',
            });
        } finally {
            state.loading = false;
        }
    },

    async getDadosParaRelatorio() {
        try {
            state.loading = true;
            const params = {
                idTransportadora: Array.isArray(state.transportadora) && state.transportadora.length > 0 ? state.transportadora[0].value : 0,
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
                ordem: state.ordenacao
            };

            const response = await serviceRelatorioConhecimento.getRelatorioConhecimento(params);
            const dados = response.dadosRelatorio;

            const totalPagamento = dados.reduce((acc, item) => acc + Number(item.PAGAMENTO || 0), 0);

            const linhaTotal = {
                NOME_FANTAZIA: '',
                NUM_NOTA: '',
                NUM_CONHECIMENTO: '',
                DATA_CONHECIMENTO: '',
                TOTAL_FATURA: '',
                PERCENTUAL: 'Totalizador:',
                PAGAMENTO: totalPagamento,
            };


            // @ts-ignore
            state.dadosRelatorio = [...dados, linhaTotal];
            state.totalItems = state.dadosRelatorio.length;
        } catch (error) {
            console.error("Erro ao obter os dados do relatório:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar dados para o relatório.',
            });
            state.dadosRelatorio = [];
            state.totalItems = 0;
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        if (!actions.validarInputs()) {
            return;
        }

        if (!state.dadosRelatorio || state.dadosRelatorio.length === 0) {
            Swal.fire({
                icon: 'warning',
                text: 'Não a dados para atualizar a impressão',
            });
            return;
        }

        try {
            state.loading = true;
            const relatorioAjustado = actions.formatarDadosImpressao([...state.dadosRelatorio]);
            const columns: iColumnPrint[] = [
                { key: 'NOME_FANTAZIA', label: 'Nome', align: 'left' },
                { key: 'NUM_NOTA', label: 'Nº Nota', align: 'center' },
                { key: 'NUM_CONHECIMENTO', label: 'Nº Conhecimento', align: 'center' },
                { key: 'DATA_CONHECIMENTO', label: 'Data Conhecimento', align: 'center' },
                { key: 'TOTAL_FATURA', label: 'Total Fatura', align: 'right' },
                { key: 'PERCENTUAL', label: '%', align: 'right' },
                { key: 'PAGAMENTO', label: 'Pagar', align: 'right' },
            ];

            const titulo = `
                <div style="text-align: center;">
                    <strong style="font-size: 16px;"> Relatorio de Conhecimento. </strong>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo);
        } catch (error) {
            console.error("Erro ao imprimir o relatório:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao imprimir relatorio.',
            });
        } finally {
            state.loading = false;
        }
    },

    formatarDadosImpressao(data: iRelatorioConhecimento[]) {
        return data.map(item => ({
            ...item,
            DATA_CONHECIMENTO: item.DATA_CONHECIMENTO ? moment(item.DATA_CONHECIMENTO).format('DD/MM/YYYY') : '----',
        }));
    },

    updatePage(newPage: number) {
        state.page = newPage;
        actions.getDadosParaRelatorio();
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};
