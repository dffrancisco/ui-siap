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
import printJS from "print-js";

export const vendasOrdenadas = computed(() => {
    let totalQtdVendas = 0;
    let totalLimite = 0;
    let totalTicketMedio = 0;
    let totalQtdItens = 0;
    let totalDevolucoes = 0;
    let totalValorVenda = 0;
    let totalValorLiquido = 0;

    state.dbVendas.forEach(venda => {

        totalQtdVendas += venda.QTD_VENDAS;
        totalLimite += venda.LIMITE;
        totalTicketMedio += venda.TICKET_MEDIO;
        totalQtdItens += venda.QTD_ITENS;
        totalDevolucoes += venda.VALOR_DEVOLUCAO;
        totalValorVenda += venda.VALOR_VENDA;
        totalValorLiquido += venda.VENDA_LIQUIDA;

    })

    if (state.dbVendas.length > 0) {
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

        state.dbVendas.push(totalizador)
    }

    return state.dbVendas
})

export const state = reactive({
    dbVendas: <iVenda[]>[],

    dbVendasDetalhes: <iGetVendasDetalhesResponse>{},

    modalVendasDetalhes: <iModalCreate>{},
    modalVendasDetalhesOpened: false,

    modalVendasGraficos: <iModalCreate>{},
    modalVendasGraficosOpened: false,

    headers: <any>[
        { title: 'Vendedor', key: 'LOGIN', width: '30%' },
        {
            title: 'Limite Crédito', key: 'LIMITE',
            value: (venda: iVenda) => utils.formatValor(venda.LIMITE)
        },
        {
            title: 'Venda', key: 'VALOR_VENDA',
            value: (venda: iVenda) => utils.formatValor(venda.VALOR_VENDA)
        },
        {
            title: 'Devolução', key: 'VALOR_DEVOLUCAO',
            value: (venda: iVenda) => utils.formatValor(venda.VALOR_DEVOLUCAO)
        },
        {
            title: 'Ved.Líquida', key: 'VENDA_LIQUIDA',
            value: (venda: iVenda) => utils.formatValor(venda.VENDA_LIQUIDA)
        },
        {
            title: 'Ticket Médio', key: 'TICKET_MEDIO',
            value: (venda: iVenda) => utils.formatValor(venda.TICKET_MEDIO)
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

        if (moment(state.dataFinal).isAfter(moment())) {
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

        if (!state.dataInicial || !state.dataFinal) {
            await Swal.fire({
                text: "Insira a data inicial e final!",
                icon: "warning"
            })
            return;
        }

        await actions.getVendas();

    },

    init() {
        actions.createModais()

        state.inputDataInicial = <any>document.getElementById("DATA_INICIAL");
        state.inputDataFinal = <any>document.getElementById("DATA_FINAL");

        state.inputDataInicial.focus();
    },

    createModalVendasDetalhes(nomeVendedor: string) {
        state.modalVendasDetalhes = new xModal.create({
            el: "#modalVendasDetalhes",
            height: 750,
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
            height: 700,
            width: 850,
            title: 'Gráficos',
            theme: 'xModal-blue',
            onOpen: () => { state.modalVendasGraficosOpened = true; },
            onClose: () => { state.modalVendasGraficosOpened = false; },
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

    async imprimirVendas() {
        try {
            state.loading = true

            let dadosToPrint = state.dbVendas.map(venda => {
                return {
                    LOGIN: venda.LOGIN,
                    LIMITE: utils.formatValor(venda.LIMITE),
                    VALOR_VENDA: utils.formatValor(venda.VALOR_VENDA),
                    VALOR_DEVOLUCAO: utils.formatValor(venda.VALOR_DEVOLUCAO),
                    VENDA_LIQUIDA: utils.formatValor(venda.VENDA_LIQUIDA),
                    TICKET_MEDIO: utils.formatValor(venda.TICKET_MEDIO),
                    QTD_MEDIA_ITENS: utils.formatValor(venda.QTD_ITENS / venda.QTD_VENDAS)
                };
            });

            printJS({
                printable: dadosToPrint,
                properties: [
                    { field: 'LOGIN', displayName: 'Vendedor' },
                    { field: 'LIMITE', displayName: 'Limite Crédito' },
                    { field: 'VALOR_VENDA', displayName: 'Venda' },
                    { field: 'VALOR_DEVOLUCAO', displayName: 'Devolução' },
                    { field: 'VENDA_LIQUIDA', displayName: 'Ved.Líquida' },
                    { field: 'TICKET_MEDIO', displayName: 'Ticket Médio' },
                    { field: 'QTD_MEDIA_ITENS', displayName: 'Qtd.Média Itens' },
                ],
                type: 'json',
                gridHeaderStyle: 'border: 1px solid #000000',
                gridStyle: 'text-align: center; border: 1px solid #000000',
            })

            state.loading = false
        } catch (error) {
            state.loading = false;
            Swal.fire({
                text: 'Erro ao imprimir as vendas!',
                icon: "error"
            })
        }
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
                text: 'Erro ao exibir as vendas!'
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