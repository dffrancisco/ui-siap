import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceRelatorioConhecimento from './services/relatorioDeConhecimento.service';
import { iTransportadora, iRelatorioConhecimento, iParamsRelatorioConhecimento } from './interfaces';
import utils, { iColumnPrint, dataBrasil } from '@/ts/utils';


export const state = reactive({
    loading: false,
    transportadoras: <iTransportadora[]>[],
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    dadosRelatorio: [] as iRelatorioConhecimento[],
    selectTransportadora: null as number | null,
    selectedOrdem: <string[]>[],
    ordem: ['DATA', 'NOME', 'Nº CONHECIMENTO', 'Nº NOTA'],
    inputDataFinal: <HTMLInputElement>{},
    inputDataInicio: <HTMLInputElement>{},
    headers: <any>[
        { key: 'CONTADOR', title: ' ', sortable: false, align: 'center' },
        { key: 'NOME_FANTAZIA', title: 'Nome', sortable: true, align: 'left' },
        { key: 'NUM_NOTA', title: 'Nº Nota', sortable: true, align: 'center' },
        { key: 'NUM_CONHECIMENTO', title: 'Nº Conhecimento', sortable: true, align: 'center' },
        { key: 'DATA_CONHECIMENTO', title: 'Data Conhecimento', sortable: true, align: 'center', value: (item: iRelatorioConhecimento) => dataBrasil(item.DATA_CONHECIMENTO) },
        { key: 'TOTAL_FATURA', title: 'Total Fatura', sortable: true, align: 'right', value: (item: iRelatorioConhecimento) => typeof item.TOTAL_FATURA === 'number' ? utils.formatValor(item.TOTAL_FATURA) : item.TOTAL_FATURA },
        { key: 'PERCENTUAL', title: '%', sortable: true, align: 'right' },
        { key: 'PAGAMENTO', title: 'Pagar', sortable: true, align: 'center', value: (item: iRelatorioConhecimento) => utils.formatValor(item.PAGAMENTO) },
    ],
});

export const actions = {
    async init() {
        state.inputDataInicio = <any>document.getElementById("dataInicio");
        state.inputDataFinal = <any>document.getElementById("dataFim");
        await actions.getTransportadoras();
    },

    validarInputs(): boolean {
        if (!state.selectTransportadora) {
            Swal.fire({
                icon: 'warning',
                text: 'Selecione uma transportadora para realizar o filtro',
            });
            return false;
        }
        if (!state.dataInicio || !state.dataFim ||
            moment(state.dataInicio).isAfter(moment(state.dataFim)) ||
            moment(state.dataInicio).isAfter(moment()) ||
            moment(state.dataFim).isAfter(moment()) ||
            moment(state.dataInicio).year() < 2000 ||
            moment(state.dataFim).year() < 2000) {

            Swal.fire({
                icon: 'warning',
                text: 'Insira uma data válida.',
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
            state.transportadoras = data;

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
                idTransportadora: state.selectTransportadora,
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
                ordem: state.selectedOrdem
            };

            const response = await serviceRelatorioConhecimento.getRelatorioConhecimento(params as unknown as iParamsRelatorioConhecimento);
            let dados = response.dadosRelatorio;


            dados = dados.map((item, CONTADOR) => ({
                ...item,
                CONTADOR: CONTADOR + 1,
            }));

            const totalPagamento = dados.reduce((acc, item) => acc + Number(item.PAGAMENTO || 0), 0);

            const linhaTotal = {
                index: '—',
                NOME_FANTAZIA: 'Totalizador:',
                NUM_NOTA: '',
                NUM_CONHECIMENTO: '',
                DATA_CONHECIMENTO: '',
                PERCENTUAL: '',
                PAGAMENTO: totalPagamento,
                TOTAL_FATURA: '',
                CONTADOR: '',
            };

            state.dadosRelatorio = [...dados, linhaTotal];
        } catch (error) {
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
                text: 'Não há dados para atualizar a impressão',
            });
            return;
        }

        try {
            state.loading = true;
            const relatorioAjustado = actions.formatarDadosImpressao([...state.dadosRelatorio]);
            const columns: iColumnPrint[] = [
                { key: 'CONTADOR', label: ' ', align: 'center', width: '5px' },
                { key: 'NOME_FANTAZIA', label: 'Nome', align: 'left', width: '25px' },
                { key: 'NUM_NOTA', label: 'Nº Nota', align: 'center' },
                { key: 'NUM_CONHECIMENTO', label: 'Nº Conhecimento', align: 'center' },
                { key: 'DATA_CONHECIMENTO', label: 'Data Conhecimento', align: 'center' },
                { key: 'TOTAL_FATURA', label: 'Total Fatura', align: 'right' },
                { key: 'PERCENTUAL', label: '%', align: 'right' },
                { key: 'PAGAMENTO', label: 'Pagar', align: 'right' },
            ];

            const titulo = `
                   <div style="display: flex; justify-content: center; width: 100%; margin-top: 10px">
                       <span>&nbsp;</span>
                       <strong style="font-size: 14px;">Relatório de conhecimento - Período: ${utils.dataBrasil(state.dataInicio)} até: ${utils.dataBrasil(state.dataFim)}</strong>
                   </div>
               `;

            const reducaoFonte = `
                <style>
                    table {
                        font-size: 12px;
                    }
                </style>
            `;

            await utils.printComCabecalho(columns, relatorioAjustado, titulo + reducaoFonte);
        } catch (error) {

            Swal.fire({
                icon: 'error',
                text: 'Erro ao imprimir relatorio.',
            });
        } finally {
            state.loading = false
        }
    },

    formatarDadosImpressao(data: iRelatorioConhecimento[]) {
        return data.map(item => ({
            ...item,
            DATA_CONHECIMENTO: item.DATA_CONHECIMENTO ? moment(item.DATA_CONHECIMENTO).format('DD/MM/YYYY') : '----',
            TOTAL_FATURA: typeof item.TOTAL_FATURA === 'number' ? utils.formatValor(item.TOTAL_FATURA) : item.TOTAL_FATURA,
            PAGAMENTO: utils.formatValor(item.PAGAMENTO),
            NUM_CONHECIMENTO: item.NUM_CONHECIMENTO || '----',
        }));
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};
