import { reactive } from 'vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import serviceConsultaValePeças from './services/consultaValePecas.service';
import { iParamsValePeca, iParamsItemOrcamento, iResponseOrcamento, iFuncionario } from './interfaces';
import utils, { iColumnPrint } from "@/ts/utils";
import { mesesToSelect } from "@/constants/constants";


export const meses = mesesToSelect;
const ano = moment().year();

export const state = reactive({
    loading: false,
    meses: meses,
    ano: ano,
    numFabricante: '',
    marcas: [] as any[],
    dadosRelatorio: [] as iParamsValePeca[],
    dadosRelatorioVales: [] as iParamsValePeca[],
    itensOrcamento: [] as any[],
    dbSelectItem: null,
    dataInicio: '',
    dataFim: '',
    inputDataFinal: '',
    mesSelecionado: null,
    numeroOrcamento: null,
    selectedFuncionario: <number[]>[],
    funcionarios: <iFuncionario[]>[],
    totalmes: '',
    total: '',
    headers: <any>[
        { key: 'V_NOME_FUNCIONARIO', title: 'Nome do Funcionário', sortable: true, align: 'center' },
        { key: 'NUM_ORCAMENTO', title: 'Nº Orçamento', sortable: true, align: 'left' },
        { key: 'DATA_ORCAMENTO', title: 'Data Vencimento', sortable: true, align: 'left' },
        { key: 'VALOR', title: 'Valor', sortable: true, align: 'left' },
        { key: 'MES', title: 'Mês', sortable: true, align: 'left' },
        { key: 'ANO', title: 'Ano', sortable: true, align: 'left' },
        { key: 'DIV', title: 'Parcela.', sortable: true, align: 'left' },
    ],

});

export const actions = {
    async init() {
        await actions.getFuncionarios();
    },

    validarInputs() {
        actions.getConsultarVales();
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

    async getConsultarVales() {
        try {
            state.loading = true;

            let param: iParamsValePeca = {
                ano: state.ano,
                cod_funcionarios: state.selectedFuncionario,
            }

            const data = await serviceConsultaValePeças.consultarVales(param);
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

    async getConsultarValePeca() {
        try {
            state.loading = true;
            // const param = {
            //     ano: state.ano,
            //     funcionario: state.funcionario

            // }
            // const data = await serviceConsultaValePeças.getconsultarValePeca(param);
            // state.dadosRelatorio = data;
            // return data;
        } catch (error) {
            Swal.fire({
                text: "Erro ao buscar o Vale peça",
                icon: "error",
            });
        } finally {
            state.loading = false;
        }
    },


    async getOrcamento(param: iResponseOrcamento) {
        try {
            state.loading = true;

            const data = await serviceConsultaValePeças.getOrcamento(param);
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

    async getItensOrcamento(param: iParamsItemOrcamento) {
        try {
            state.loading = true;

            const data = await serviceConsultaValePeças.getItensOrcamento(param);
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

    // async onClickBuscar() {
    //     if (actions.validarInputs()) {
    //         await actions.getConsultarValePeca();
    //     }
    // },

    // async onClickImprimir() {
    //     if (!actions.validarInputs() || !state.dadosRelatorio?.length) {
    //         Swal.fire({
    //             icon: 'warning',
    //             text: 'Não há dados para realizar a impressão.',
    //         });
    //         return;
    //     }


    //     try {
    //         state.loading = true;

    //         const columns: iColumnPrint[] = [
    //             { key: 'V_NOME_FUNCIONARIO', label: 'Funcionário', align: 'center' },
    //             { key: 'NUM_ORCAMENTO', label: 'Orçamento', align: 'left' },
    //             { key: 'DATA_ORCAMENTO', label: 'Data Venc.', align: 'left' },
    //             { key: 'VALOR', label: 'Valor', align: 'right' },
    //             { key: 'MES', label: 'Mês', align: 'center' },
    //             { key: 'ANO', label: 'Ano', align: 'center' },
    //             { key: 'DIV', label: 'Parcela', align: 'center' },
    //         ];

    //         const titulo = `
    //             <div style="text-align: center;">
    //                 <strong style="font-size: 16px;">Relatório de Vale Peças</strong>
    //                 <div style="font-size: 14px;">Período: ${state.ano}</div>
    //             </div>
    //         `;

    //         await utils.printComCabecalho(columns, state.dadosRelatorio, titulo);
    //     } catch (error) {
    //         console.error("Erro ao imprimir:", error);
    //         Swal.fire({
    //             icon: 'error',
    //             text: 'Erro ao gerar relatório impresso.',
    //         });
    //     } finally {
    //         state.loading = false;
    //     }
    // },

    formatarDadosImpressao(data: any[]) {
        return data.map(item => ({
            ...item,
            ULTIMA_ENTRADA: item.ULTIMA_ENTRADA ? moment(item.ULTIMA_ENTRADA).format('DD/MM/YYYY') : '----',
        }));
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2';
        return { class: classe };
    },
};
