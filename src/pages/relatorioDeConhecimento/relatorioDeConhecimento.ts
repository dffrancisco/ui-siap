import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceRelatorioConhecimento from './services/relatorioDeConhecimento.service';
import { iParamsRelatorioConhecimento, iTransportadora, iRelatorioConhecimento } from './interfaces';
import utils, { iColumnPrint } from '@/ts/utils';

export const state = reactive({
    loading: false,
    transportadora: null,
    dataInicio: moment().subtract(1, 'month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    dadosRelatorio: [] as iRelatorioConhecimento[],
    totalItems: 0,
    transportadoras: <iTransportadora[]>[],
    ordenacao: 'dataConhecimento',
    ordenacaoOptions:
        <any>[
            { value: 'dataConhecimento', label: 'Data' },
            { value: 'nomeFantasia', label: 'Nome' },
            { value: 'numConhecimento', label: 'Nº Conhecimento' },
            { value: 'numNota', label: 'Nº Nota Fiscal' },
        ],
    itemsPerPage: 10,
    page: 1,
    headers: <any>[
        { key: 'NOME_FANTASIA', title: 'Nome', sortable: true, align: 'left' },
        { key: 'NUM_NOTA', title: 'Nº Nota', sortable: true, align: 'center' },
        { key: 'NUM_CONHECIMENTO', title: 'Nº Conhecimento', sortable: true, align: 'center' },
        { key: 'DATA_CONHECIMENTO', title: 'Data Conhecimento', sortable: true, align: 'center' },
        { key: 'TOTAL_FATURA', title: 'Total Fatura', sortable: true, align: 'right' },
        { key: 'PERCENTUAL', title: '%', sortable: true, align: 'right' },
        { key: 'PAGAMENTO', title: 'Pagar', sortable: true, align: 'right' },
    ],
});

export const actions = {
    async init() {
        await actions.getDadosParaRelatorio();
    },

    validarInputs(): boolean {
        if (!state.transportadora) {
            Swal.fire({
                icon: 'warning',
                text: 'Selecione uma transportadora para realizar o filtro.',
            });
            return false;

        }

        if (!state.dataInicio || !state.dataFim) {
            Swal.fire({
                icon: 'warning',
                text: 'Selecione um intervalo de datas válido.',
            });
            return false;
        }

        if (moment(state.dataInicio).isAfter(moment(state.dataFim))) {
            Swal.fire({
                icon: 'warning',
                text: 'A data inicial não pode ser maior que a data final.',
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

            const response = await serviceRelatorioConhecimento.getTransportadoras();


            if (response && Array.isArray(response)) {
                state.transportadora = response.map((item: iTransportadora) => ({
                    value: item.ID_TRANSPORTADORA,
                    label: item.RAZAO_SOCIAL,
                }));
            } else {
                console.warn("Resposta inesperada ao buscar transportadoras:", response);
                state.transportadoras = [];
            }

        } catch (error) {
            console.error("Erro ao obter transportadoras:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar transportadoras.',
            });
            state.transportadoras = [];
        } finally {
            state.loading = false;
        }
    },

    async getDadosParaRelatorio() {
        try {
            state.loading = true;

            const params: iParamsRelatorioConhecimento = {
                idTransportadora: state.transportadora ?? 0,
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
            };

            const response = await serviceRelatorioConhecimento.getRelatorioConhecimento(params);

            if (response && Array.isArray(response)) {
                state.dadosRelatorio = response;
            } else {
                console.warn("Resposta inesperada da API:", response);
                state.dadosRelatorio = [];
            }

        } catch (error) {
            console.error("Erro ao obter os dados do relatório:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar dados para o relatório.',
            });
            state.dadosRelatorio = [];
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
                { key: 'NOME_FANTASIA', label: 'Nome', align: 'left' },
                { key: 'NUM_NOTA', label: 'Nº Nota', align: 'center' },
                { key: 'NUM_CONHECIMENTO', label: 'Nº Conhecimento', align: 'center' },
                { key: 'DATA_CONHECIMENTO', label: 'Data Conhecimento', align: 'center' },
                { key: 'TOTAL_FATURA', label: 'Total Fatura', align: 'right' },
                { key: 'PERCENTUAL', label: '%', align: 'right' },
                { key: 'PAGAMENTO', label: 'Pagar', align: 'right' },
            ];

            const titulo = `
                <div style="text-align: center;">
                    <strong style="font-size: 16px;"> Relatório de Conhecimento </strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo);
        } catch (error) {
            console.error("Erro ao imprimir o relatório:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao imprimir relatório.',
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
