import { reactive } from "vue"
import modalhistoricoProdutoService from "./services/modalhistoricoProduto.service"
import { iComprasHistoricoProduto, iDevolucoesHistoricoProduto, iEntradasHistoricoProduto, iLogEstoquesNew, iDadosIniciaisHistoricosProdutos, iOrcamento, iOrcamentoItens, iSaidasHistoricoProduto } from "./interface"
import moment from "moment";
import Loading from "../Loading.vue";


const nomeMeses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export const state = reactive({
    entradas: <iEntradasHistoricoProduto[]>[],
    saidas: <iSaidasHistoricoProduto[]>[],
    compras: <iComprasHistoricoProduto[]>[],
    estoques: <iLogEstoquesNew[]>[],
    devolucoes: <iDevolucoesHistoricoProduto[]>[],
    meses: <iDadosIniciaisHistoricosProdutos[]>[],
    orcamento: <iOrcamento>{},
    orcamentoItens: <iOrcamentoItens[]>[],
    pgEntradas: 0,
    pgSaidas: 0,
    pgCompras: 0,
    pgEstoques: 0,
    pgDevolucoes: 0,
    carregando: false,
    verMaisEntradas: true,
    verMaisSaidas: true,
    verMaisDevolucoes: true,
    verMaisCompras: true,
    verMaisEstoque: true,
    dataFim: "",
    dataInicio: "",
    loading: false,
    modalAbrirHistoricoSaida: false,
    codProduto: undefined,
    nomeProduto: "",
    loadingSkeletonDadosIniciais: true,
    loadingSkeletonEntrada: true,
    loadingSkeletonSaida: true,
    loadingSkeletonEstoque: true,
    loadingSkeletonDevolucao: true,
    loadingSkeletonCompras: true,
    loadingSkeletonTextoVendaMeses: true,
})

export const actions = {
    async init(codProduto: number) {
        state.codProduto = codProduto;
        state.entradas = [];
        state.meses = [];
        state.saidas = [];
        state.compras = [];
        state.estoques = [];
        state.devolucoes = [];
        state.pgEntradas = 0;
        state.pgSaidas = 0;
        state.pgCompras = 0;
        state.pgEstoques = 0;
        state.pgDevolucoes = 0;
        state.verMaisEntradas = true;
        state.verMaisSaidas = true;
        state.verMaisDevolucoes = true;
        state.verMaisCompras = true;
        state.verMaisEstoque = true;
        state.loadingSkeletonDadosIniciais = true;
        state.loadingSkeletonEntrada = true;
        state.loadingSkeletonSaida = true;
        state.loadingSkeletonEstoque = true;
        state.loadingSkeletonDevolucao = true;
        state.loadingSkeletonCompras = true;
        state.loadingSkeletonTextoVendaMeses = true;

        await actions.getEntradaHistoricoProduto();
        await actions.getSaidas();
        await actions.getCompras();
        await actions.getEstoquesNew();
        await actions.getDadosIniciais();
        await actions.getDevolucoes();


    },


    async onclickAbrir(saida: iSaidasHistoricoProduto) {

        try {
            state.loading = false
            state.orcamento = await modalhistoricoProdutoService.getOrcamento(saida.NUM_ORCAMENTO, saida.DATA_VENDA)
            state.orcamentoItens = await modalhistoricoProdutoService.getItensOrcamento(saida.NUM_ORCAMENTO, saida.DATA_VENDA)
            state.modalAbrirHistoricoSaida = true;
            state.loading = false

        }
        catch (error) {
            console.log(error)
            state.loading = false
        }

    },


    async getEntradaHistoricoProduto() {
        state.loading = true
        try {

            const param = { COD_PRODUTO: state.codProduto, pg: state.pgEntradas }
            const novasEntradas = await modalhistoricoProdutoService.getEntradas(param as any)

            if (!novasEntradas.length) {
                state.verMaisEntradas = false
                return
            }


            state.entradas = [...state.entradas, ...novasEntradas]

            state.pgEntradas++

            state.loading = false
            state.loadingSkeletonEntrada = false
        }
        catch (error) {
            console.log(error)
            state.loading = false
        }
    },

    async getSaidas() {

        try {

            const param = { COD_PRODUTO: state.codProduto, pg: state.pgSaidas }
            const novasSaidas = await modalhistoricoProdutoService.getSaidas(param as any)

            if (!novasSaidas.length) {
                state.verMaisSaidas = false
                return
            }

            state.saidas = [...state.saidas, ...novasSaidas]

            state.pgSaidas++
            state.loading = false
            state.loadingSkeletonSaida = false
        }
        catch (error) {
            console.log(error)
            state.loading = false
        }
    },

    async getCompras() {
        state.loading = true
        try {
            const param = { COD_PRODUTO: state.codProduto, pg: state.pgCompras }
            const novasCompras = await modalhistoricoProdutoService.getCompras(param as any)

            if (!novasCompras.length) {
                state.verMaisCompras = false
                return
            }

            state.compras = [...state.compras, ...novasCompras]

            state.pgCompras++
            state.loading = false
            state.loadingSkeletonCompras = false
        }
        catch (error) {
            console.log(error)
            state.loading = false
        }
    },

    async getDevolucoes() {
        state.loading = true
        try {
            const param = { COD_PRODUTO: state.codProduto, pg: state.pgDevolucoes }
            const novasDevolucoes = await modalhistoricoProdutoService.getDevolucoes(param as any)

            if (!novasDevolucoes.length) {
                state.verMaisDevolucoes = false
                return
            }

            state.devolucoes = [...state.devolucoes, ...novasDevolucoes]

            state.pgDevolucoes++
            state.loading = false
            state.loadingSkeletonDevolucao = false
        }
        catch (error) {
            console.log(error)
            state.loading = false
        }
    },

    async getDadosIniciais() {
        try {
            const dataInicio = moment();
            const dataFim = moment().subtract(12, 'months');

            const param = {
                COD_PRODUTO: state.codProduto,
                dataInicio: dataInicio.format('YYYY-MM-DD'),
                dataFim: dataFim.format('YYYY-MM-DD'),
            };
            const dadosIniciais = await modalhistoricoProdutoService.getDadosIniciais(param as any);

            state.nomeProduto = dadosIniciais[0].DESC_PRODUTO

            const mesesCompletos = [];


            for (let i = 1; i <= 12; i++) {
                const dataInicial = moment().subtract(12 - i, 'months');
                const nomeMesIndice = parseInt(dataInicial.format('MM'));
                const ano = parseInt(dataInicial.format('YYYY'));
                const nomeMes = nomeMeses[nomeMesIndice - 1];

                const resultadoMovAnual = dadosIniciais.find((item: any) =>
                    parseInt(item.MES) === nomeMesIndice && parseInt(item.ANO) === ano
                );

                const mesAtual = dataInicial.isSame(moment(), 'month');

                mesesCompletos.push({
                    MES: nomeMes,
                    ANO: ano,
                    QUANTIDADE: resultadoMovAnual ? resultadoMovAnual.QUANTIDADE : 0,
                    ATUAL: mesAtual
                });
            }

            state.meses = mesesCompletos;
            state.loadingSkeletonDadosIniciais = false;
            state.loadingSkeletonTextoVendaMeses = false;

        }
        catch (error) {
            console.log(error)
            state.loading = false

        }
    },
    async getEstoquesNew() {
        state.loading = true
        try {
            const param = { COD_PRODUTO: state.codProduto, pg: state.pgEstoques }
            const novosEstoques = await modalhistoricoProdutoService.getLogEstoquesNew(param as any)

            if (!novosEstoques.length) {
                state.verMaisEstoque = false
                return
            }

            state.estoques = [...state.estoques, ...novosEstoques]

            state.pgEstoques++
            state.loading = false
            state.loadingSkeletonEstoque = false
        }
        catch (error) {
            console.log(error)

            state.loading = false
        }
    },
}

