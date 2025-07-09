import { reactive } from "vue"
import modalhistoricoProdutoService from "./services/modalhistoricoProduto.service"
import { iComprasHistoricoProduto, iDevolucoesHistoricoProduto, iEntradasHistoricoProduto, iLogEstoquesNew, iDadosIniciaisHistoricosProdutos, iOrcamento, iOrcamentoItens, iSaidasHistoricoProduto, iMovAnual } from "./interface"
import moment from "moment";
import { swalDarkError } from "@/ts/utils";


const nomeMeses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export const state = reactive({
    entradas: <iEntradasHistoricoProduto[]>[],
    saidas: <iSaidasHistoricoProduto[]>[],
    compras: <iComprasHistoricoProduto[]>[],
    estoques: <iLogEstoquesNew[]>[],
    dadosIniciais: <iDadosIniciaisHistoricosProdutos>{},
    devolucoes: <iDevolucoesHistoricoProduto[]>[],
    meses: <iMovAnual[]>[],
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


    async onclickModalSaidas(saida: iSaidasHistoricoProduto) {

        try {
            state.orcamento = await modalhistoricoProdutoService.getOrcamento(saida.NUM_ORCAMENTO, saida.DATA_VENDA)
            state.orcamentoItens = await modalhistoricoProdutoService.getItensOrcamento(saida.NUM_ORCAMENTO, saida.DATA_VENDA)
            state.modalAbrirHistoricoSaida = true;


        }
        catch (error) {
            swalDarkError('Ocorreu um erro ao Abrir o histórico de saídas')
        }

    },


    async getEntradaHistoricoProduto() {
        state.loadingSkeletonEntrada = true
        try {

            const param = { COD_PRODUTO: state.codProduto, pg: state.pgEntradas }
            const novasEntradas = await modalhistoricoProdutoService.getEntradas(param as any)

            if (!novasEntradas.length) {
                state.verMaisEntradas = false
                state.loadingSkeletonEntrada = false
                return
            }


            state.entradas = [...state.entradas, ...novasEntradas]

            state.pgEntradas++


            state.loadingSkeletonEntrada = false
        }
        catch (error) {


            swalDarkError('Ocorreu um erro ao buscar as entradas')
        }
    },

    async getSaidas() {
        state.loadingSkeletonSaida = true
        try {

            const param = { COD_PRODUTO: state.codProduto, pg: state.pgSaidas }
            const novasSaidas = await modalhistoricoProdutoService.getSaidas(param as any)

            if (!novasSaidas.length) {
                state.verMaisSaidas = false
                state.loadingSkeletonSaida = false

                return
            }

            state.saidas = [...state.saidas, ...novasSaidas]

            state.pgSaidas++

            state.loadingSkeletonSaida = false
        }
        catch (error) {


            swalDarkError('Ocorreu um erro ao buscar as saídas')
        }
    },

    async getCompras() {
        state.loadingSkeletonCompras = true
        try {
            const param = { COD_PRODUTO: state.codProduto, pg: state.pgCompras }
            const novasCompras = await modalhistoricoProdutoService.getCompras(param as any)

            if (!novasCompras.length) {

                state.verMaisCompras = false
                state.loadingSkeletonCompras = false
                return
            }

            state.compras = [...state.compras, ...novasCompras]

            state.pgCompras++

            state.loadingSkeletonCompras = false
        }
        catch (error) {

            swalDarkError('Ocorreu um erro ao buscar os pedidos')
        }
    },

    async getDevolucoes() {
        state.loadingSkeletonDevolucao = true
        try {
            const param = { COD_PRODUTO: state.codProduto, pg: state.pgDevolucoes }
            const novasDevolucoes = await modalhistoricoProdutoService.getDevolucoes(param as any)

            if (!novasDevolucoes.length) {
                state.verMaisDevolucoes = false
                state.loadingSkeletonDevolucao = false
                return

            }

            state.devolucoes = [...state.devolucoes, ...novasDevolucoes]

            state.pgDevolucoes++
            state.loadingSkeletonDevolucao = false
        }
        catch (error) {
            state.loadingSkeletonDevolucao = false
            swalDarkError('Ocorreu um erro ao buscar as devoluções')

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

            state.dadosIniciais = await modalhistoricoProdutoService.getDadosIniciais(param as any);


            state.nomeProduto = state.dadosIniciais.PRODUTO.DESC_PRODUTO
            const mesesCompletos = [];

            for (let i = 1; i <= 12; i++) {
                const dataInicial = moment().subtract(12 - i, 'months');
                const nomeMesIndice = parseInt(dataInicial.format('MM'));
                const ano = parseInt(dataInicial.format('YYYY'));
                const nomeMes = nomeMeses[nomeMesIndice - 1];

                const resultadoMovAnual = state.dadosIniciais.MOV_ANUAL.find((item: any) =>
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
            swalDarkError('Ocorreu um erro ao buscar os meses')

        }
    },
    async getEstoquesNew() {
        state.loadingSkeletonEstoque = true
        try {
            const param = { COD_PRODUTO: state.codProduto, pg: state.pgEstoques }
            const novosEstoques = await modalhistoricoProdutoService.getLogEstoquesNew(param as any)

            if (!novosEstoques.length) {
                state.verMaisEstoque = false
                state.loadingSkeletonEstoque = false
                return
            }

            state.estoques = [...state.estoques, ...novosEstoques]

            state.pgEstoques++
            state.loadingSkeletonEstoque = false
        }
        catch (error) {
            swalDarkError('Ocorreu um erro ao buscar o Estoque')
        }
    },
}

