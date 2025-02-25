import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceConsultaValePeças from './services/consultaValePecas.service';
import { iParamsValePeca, iFuncionario } from './interfaces';
import utils, { iColumnPrint, dataBrasil } from "@/ts/utils";
import { mesesToSelect } from "@/constants/constants";


export const meses = mesesToSelect;
const ano = moment().year();

export const state = reactive({
    loading: false,
    meses: meses,
    ano: ano,
    dadosRelatorio: [] as iParamsValePeca[],
    dadosRelatorioVales: [] as iParamsValePeca[],
    itensOrcamento: [] as any[],
    selectedFuncionario: <number[]>[],
    funcionarios: <iFuncionario[]>[],
    totalmes: '',
    modalValeOpened: false,
    total: '',
    dbSelectItem: {} as iParamsValePeca,
    headers: <any>[
        { key: 'V_NOME_FUNCIONARIO', title: 'Nome do Funcionário', sortable: true, align: 'left' },
        { key: 'NUM_ORCAMENTO', title: 'Nº Orçamento', sortable: true, align: 'left' },
        { key: 'DATA_ORCAMENTO', title: 'Data Vencimento', sortable: true, align: 'left', value: (item: iParamsValePeca) => dataBrasil(item.DATA_ORCAMENTO) },
        { key: 'VALOR', title: 'Valor', sortable: true, align: 'left' },
        { key: 'MES', title: 'Mês', sortable: true, align: 'left' },
        { key: 'ANO', title: 'Ano', sortable: true, align: 'left' },
        { key: 'DIV', title: 'Parcela.', sortable: true, align: 'left' },
        { key: 'acao', title: 'Detalhes', sortable: true, align: 'left' },
    ],
});

export const actions = {
    async init() {
        await actions.getFuncionarios();
    },

    validarInputs() {
        if (!state.ano) {
            Swal.fire({
                icon: 'warning',
                text: 'O campo ano é obrigatório.',
            });
            return false;
        }
        actions.getConsultarVales();
        return true;
    },

    async getFuncionarios() {
        state.loading = true;

        try {
            state.funcionarios = await serviceConsultaValePeças.getFuncionarios();
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os funcionários.",
            });
        } finally {
            state.loading = false;
        }
    },

    abrirModal(item: iParamsValePeca) {
        state.dbSelectItem = item;
        state.modalValeOpened = true;
    },

    async getConsultarVales() {
        try {
            state.loading = true;

            let param: iParamsValePeca = {
                ano: state.ano,
                cod_funcionarios: state.selectedFuncionario,
            }

            const data = await serviceConsultaValePeças.consultarVales(param);
            state.dadosRelatorio = data;
            return data;
        } catch (error) {
            Swal.fire({
                text: "Erro ao buscar os Vales",
                icon: "error",
            });
        } finally {
            state.loading = false;
        }
    },


    async getOrcamento() {
        try {
            state.loading = true;

            const data = await serviceConsultaValePeças.getOrcamento();
            return data;
        } catch (error) {
            Swal.fire({
                text: "Erro ao buscar os Orcamentos",
                icon: "error",
            });
        } finally {
            state.loading = false;
        }
    },

    async getItensOrcamento() {
        try {
            state.loading = true;

            const data = await serviceConsultaValePeças.getItensOrcamento();
            return data;
        } catch (error) {
            Swal.fire({
                text: "Erro ao buscar os Orcamentos",
                icon: "error",
            });
        } finally {
            state.loading = false;
        }
    },


    async onClickImprimir() {
        if (!actions.validarInputs() || !state.dadosRelatorio?.length) {
            Swal.fire({
                icon: 'warning',
                text: 'Não há dados para realizar a impressão.',
            });
            return;
        }

        try {
            state.loading = true;

            const columns: iColumnPrint[] = [
                { key: 'V_NOME_FUNCIONARIO', label: 'Funcionário', align: 'center' },
                { key: 'NUM_ORCAMENTO', label: 'Orçamento', align: 'left' },
                { key: 'DATA_ORCAMENTO', label: 'Data Venc.', align: 'left' },
                { key: 'VALOR', label: 'Valor', align: 'right' },
                { key: 'MES', label: 'Mês', align: 'center' },
                { key: 'ANO', label: 'Ano', align: 'center' },
                { key: 'DIV', label: 'Parcela', align: 'center' },
            ];

            const titulo = `
                <div style="text-align: center;">
                    <strong style="font-size: 16px;">Relatório de Vale Peças</strong>
                    <div style="font-size: 14px;">Período: ${state.ano}</div>
                </div>
            `;

            await utils.printComCabecalho(columns, state.dadosRelatorio, titulo);
        } catch (error) {
            console.error("Erro ao imprimir:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao gerar relatório impresso.',
            });
        } finally {
            state.loading = false;
        }
    },
    formatarDadosImpressao(data) {
        return data.map(item => ({
            ...item,
            DATA_ORCAMENTO: item.DATA_ORCAMENTO ? utils.dataBrasil(item.DATA_ORCAMENTO) : '-----',
            VALOR: item.VALOR ? utils.formatValor(item.VALOR) : '-----',
        }));
    },
    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};
