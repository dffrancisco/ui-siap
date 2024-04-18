import { computed, reactive } from "vue";
import {
    iVenda,
    iParamGetVendas,
    iParamGetVendasDetalhes,
    iGetVendasDetalhesResponse
} from "./interfaces";
import serviceVendasPorVendedor from './services/vendaPorVendedor.service'
import utils from "@/ts/utils";
import Swal from "sweetalert2";
import moment from "moment";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";

export const vendasOrdenadas = computed(() => {
    let vendas = [...state.dbVendas]

    let totalQtdVendas = 0;
    let totalLimite = 0;
    let totalTicketMedio = 0;
    let totalQtdItens = 0;
    let totalDevolucoes = 0;
    let totalValorVenda = 0;
    let totalValorLiquido = 0;

    vendas.forEach(venda => {

        totalQtdVendas += venda.QTD_VENDAS;
        totalLimite += venda.LIMITE;
        totalTicketMedio += venda.TICKET_MEDIO;
        totalQtdItens += venda.QTD_ITENS;
        totalDevolucoes += venda.VALOR_DEVOLUCAO;
        totalValorVenda += venda.VALOR_VENDA;
        totalValorLiquido += venda.VENDA_LIQUIDA;

    })

    if (vendas.length > 0) {
        let totalizador = {
            LOGIN: 'Totalizador',
            LIMITE: totalLimite,
            VALOR_VENDA: totalValorVenda,
            VALOR_DEVOLUCAO: totalDevolucoes,
            QTD_VENDAS: totalQtdVendas,
            VENDA_LIQUIDA: totalValorLiquido,
            TICKET_MEDIO: totalTicketMedio,
            QTD_ITENS: totalQtdItens
        }

        vendas.push(totalizador)
    }

    return vendas
})

export const state = reactive({
    dbVendas: <iVenda[]>[],

    dbVendasDetalhes: <iGetVendasDetalhesResponse>{},

    modalVendasDetalhes: <iModalCreate>{},
    modalVendasDetalhesOpened: false,

    modalVendasGraficos: <iModalCreate>{},
    modalVendasGraficosOpened: false,

    modalImprimirVendas: <iModalCreate>{},
    modalImprimirVendasOpened: false,

    modalGrupoFuncionarios: <iModalCreate>{},
    modalGrupoFuncionariosOpened: false,

    headers: <any>[
        { title: 'Vendedor', key: 'LOGIN', width: '30%' },
        {
            title: 'Limite Crédito', key: 'LIMITE',
            value: (venda: iVenda) => utils.formatValor(venda.LIMITE),
            align: 'end'
        },
        {
            title: 'Venda', key: 'VALOR_VENDA',
            value: (venda: iVenda) => utils.formatValor(venda.VALOR_VENDA),
            align: 'end'
        },
        {
            title: 'Devolução', key: 'VALOR_DEVOLUCAO',
            value: (venda: iVenda) => utils.formatValor(venda.VALOR_DEVOLUCAO),
            align: 'end'
        },
        {
            title: 'Ved.Líquida', key: 'VENDA_LIQUIDA',
            value: (venda: iVenda) => utils.formatValor(venda.VENDA_LIQUIDA),
            align: 'end'
        },
        {
            title: 'Ticket Médio', key: 'TICKET_MEDIO',
            value: (venda: iVenda) => utils.formatValor(venda.TICKET_MEDIO),
            align: 'end'
        },
        {
            title: 'Qtd. Média Itens', key: 'QTD_MEDIA_ITENS',
            value: (venda: iVenda) => actions.calcularQtdMediaItens(venda.QTD_ITENS, venda.QTD_VENDAS)
        },
        { title: 'Inf', key: 'inf', sortable: false, align: 'center', },
    ],

    dataInicial: moment().format('YYYY-MM-DD'),
    dataFinal: moment().format('YYYY-MM-DD'),

    dataInicialModal: null,
    dataFinalModal: null,

    inputDataInicial: <HTMLInputElement>{},
    inputDataFinal: <HTMLInputElement>{},

    loading: false,
})

export const actions = {
    calcularQtdMediaItens(qtdItens: number, qtdVendas: number) {
        let resultado = qtdItens / qtdVendas

        return utils.formatValor(resultado)
    },

    async pesquisarVendas() {
        if (!state.dataInicial || !state.dataFinal) {
            await Swal.fire({
                text: "Data Inválida!",
                icon: "warning"
            })
            return;
        }

        if (moment(state.dataInicial).isAfter(moment(state.dataFinal))) {
            await Swal.fire({
                text: "Data Inicial deve ser menor que a data final.",
                icon: "warning"
            })
            return;
        }

        await actions.getVendas();
    },

    async init() {
        state.inputDataInicial = <any>document.getElementById("DATA_INICIAL");
        state.inputDataFinal = <any>document.getElementById("DATA_FINAL");

        actions.createModais()

        await actions.getVendas();
    },

    createModalVendasDetalhes(nomeVendedor: string) {
        state.modalVendasDetalhes = new xModal.create({
            el: "#modalVendasDetalhes",
            height: 660,
            width: 1000,
            title: nomeVendedor,
            theme: 'xModal-blue',
            onOpen: () => { state.modalVendasDetalhesOpened = true; },
            onClose: () => { state.modalVendasDetalhesOpened = false; state.modalVendasDetalhes.destroy() },
        });

    },

    createModais() {
        state.modalVendasGraficos = new xModal.create({
            el: "#modalVendasGraficos",
            height: 660,
            width: 850,
            title: 'Gráficos',
            theme: 'xModal-blue',
            onOpen: () => { state.modalVendasGraficosOpened = true; },
            onClose: () => { state.modalVendasGraficosOpened = false; },
        });

        state.modalImprimirVendas = new xModal.create({
            el: "#modalImprimirVendas",
            height: 600,
            width: 1030,
            title: 'Imprimir Consulta de Vendas',
            theme: 'xModal-blue',
            onOpen: () => { state.modalImprimirVendasOpened = true; },
            onClose: () => { state.modalImprimirVendasOpened = false; },
        });

        state.modalGrupoFuncionarios = new xModal.create({
            el: "#modalGrupoFuncionarios",
            height: 350,
            width: 560,
            title: 'Grupo de Funcionários',
            theme: 'xModal-blue',
            onOpen: () => { state.modalGrupoFuncionariosOpened = true; },
            onClose: () => { state.modalGrupoFuncionariosOpened = false; },
        });
    },

    async openModalVendasDetalhes(nomeVendedor: string, id_vendedor: number) {
        state.loading = true;

        actions.createModalVendasDetalhes(nomeVendedor)
        await actions.getVendasDetalhes(id_vendedor)
        state.modalVendasDetalhes.open();

        state.loading = false;
    },

    async openModalVendasGraficos() {
        state.modalVendasGraficos.open()
    },

    async openModalImprimirVendas() {
        state.modalImprimirVendas.open()
    },

    async openModalGrupoFuncionarios() {
        state.modalGrupoFuncionarios.open()
    },

    async getVendas() {
        try {
            state.loading = true

            let param: iParamGetVendas = {
                DATA_INICIO: state.dataInicial,
                DATA_FIM: state.dataFinal
            }

            let data = await serviceVendasPorVendedor.getVendas(param);

            state.dbVendas = data

            state.dataInicialModal = state.dataInicial
            state.dataFinalModal = state.dataFinal

            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: error?.response?.data?.msg || 'Erro ao exibir as vendas!'
            })
        }
    },

    async getVendasDetalhes(id_vendedor: number) {
        try {
            let param: iParamGetVendasDetalhes = {
                DATA_INICIO: state.dataInicialModal,
                DATA_FIM: state.dataFinalModal,
                ID_VENDEDOR: id_vendedor
            }

            let data = await serviceVendasPorVendedor.getVendasDetalhes(param);

            state.dbVendasDetalhes = data
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir os detalhes das vendas!'
            })
        }
    }
}

export default { state, actions }