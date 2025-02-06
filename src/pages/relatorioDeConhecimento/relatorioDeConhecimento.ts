import { reactive } from 'vue';
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

    selectedConteudo: <string[]>[],
    ordem: ['DATA', 'NOME', 'Nº CONHECIMENTO', 'Nº NOTA'],


    itemsPerPage: 10,
    headers: <any>[
        { key: 'NOME_FANTAZIA', title: 'Nome', sortable: true, align: 'left' },
        { key: 'NUM_NOTA', title: 'Nº Nota', sortable: true, align: 'center' },
        { key: 'NUM_CONHECIMENTO', title: 'Nº Conhecimento', sortable: true, align: 'center' },
        { key: 'DATA_CONHECIMENTO', title: 'Data Conhecimento', sortable: true, align: 'center', value: (item: iRelatorioConhecimento) => dataBrasil(item.DATA_CONHECIMENTO) },
        { key: 'TOTAL_FATURA', title: 'Total Fatura', sortable: true, align: 'right' },
        { key: 'PAGAMENTO', title: 'Pagar', sortable: true, align: 'center', value: (item: iRelatorioConhecimento) => utils.formatValor(item.PAGAMENTO) },
        { key: 'PERCENTUAL', title: '%', sortable: true, align: 'right' },

    ],
});


export const actions = {
    async init() {

        await actions.getTransportadoras();
    },

    validarInputs(): boolean {
        if (!state.transportadoras || state.transportadoras.length === 0) {
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
                text: 'A data inicial não pode ser maior que a data final.',
            });
            return false;
        }

        if (moment(state.dataInicio).isAfter(moment()) || moment(state.dataFim).isAfter(moment())) {
            Swal.fire({
                icon: 'warning',
                text: 'A data não pode ser maior que a data atual.',
            });
            return false;
        }

        if (moment(state.dataInicio).year() < 2000 || moment(state.dataFim).year() < 2000) {
            Swal.fire({
                icon: 'warning',
                text: 'Insira uma data valida.',
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
                idTransportadora: state.transportadoras,
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
                ordem: state.selectedConteudo
            };

            // @ts-ignore
            const response = await serviceRelatorioConhecimento.getRelatorioConhecimento(params);
            const dados = response.dadosRelatorio;

            const totalPagamento = dados.reduce((acc, item) => acc + Number(item.PAGAMENTO || 0), 0);

            const linhaTotal = {
                NOME_FANTAZIA: '',
                NUM_NOTA: '',
                NUM_CONHECIMENTO: '',
                DATA_CONHECIMENTO: '',
                PERCENTUAL: '',
                PAGAMENTO: totalPagamento,
                TOTAL_FATURA: 'Totalizador:',
            };

            // @ts-ignore
            state.dadosRelatorio = [...dados, linhaTotal];
            state.totalItems = state.dadosRelatorio.length;
        } catch (error) {
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
            PAGAMENTO: utils.formatValor(item.PAGAMENTO),
        }));
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};
