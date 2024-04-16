import { computed, reactive } from "vue";
import {
    iVenda,
    iParamGetVendasPorVendedor,
    iVendaPorDiaGrafico,
    iVendaPorHoraGrafico
} from "./interfaces";
import serviceVendasPorVendedor from './services/vendaPorVendedor.service'
import utils from "@/ts/utils";
import Swal from "sweetalert2";
import moment from "moment";

export const dadosToPrint = computed(() => {
    let dados = state.dbVendas.map(venda => {
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

    return dados
});

export const dadosVendasPorDiaToGrafico = computed(() => {
    const cabecalho = [];
    const dados = [];

    if (state.dbVendasPorDiaGrafico.length > 0) {
        state.dbVendasPorDiaGrafico.forEach((item) => {
            cabecalho.push(item.DIA);
            dados.push(item.VALOR);
        });
    }

    return {
        labels: cabecalho,
        series: dados,
    };
});

export const dadosVendasPorHoraToGrafico = computed(() => {
    const cabecalho = [];
    const dados = [];

    if (state.dbVendasPorHoraGrafico.length > 0) {
        state.dbVendasPorHoraGrafico.forEach((item) => {
            cabecalho.push(item.HORA);
            dados.push(item.VALOR);
        });
    }

    return {
        labels: cabecalho,
        series: dados,
    };
});

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
    dbVendasPorDiaGrafico: <iVendaPorDiaGrafico[]>[],
    dbVendasPorHoraGrafico: <iVendaPorHoraGrafico[]>[],

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

        await actions.getVendas();

    },

    init() {
        state.inputDataInicial = <any>document.getElementById("DATA_INICIAL");
        state.inputDataFinal = <any>document.getElementById("DATA_FINAL");

        state.inputDataInicial.focus();
    },

    async getVendas() {
        try {
            state.loading = true

            let param: iParamGetVendasPorVendedor = {
                DATA_INICIO: state.dataInicial,
                DATA_FIM: state.dataFinal
            }

            let data = await serviceVendasPorVendedor.getVendas(param);

            state.dbVendas = data.vendas
            state.dbVendasPorDiaGrafico = data.vendasPorDiaGrafico
            state.dbVendasPorHoraGrafico = data.vendasPorHoraGrafico

            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir as vendas!'
            })
        }
    }
}

export default { state, actions }