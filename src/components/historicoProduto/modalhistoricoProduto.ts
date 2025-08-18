import { reactive } from "vue"
import modalhistoricoProdutoService from "./services/modalhistoricoProduto.service"
import { iComprasHistoricoProduto, iDevolucoesHistoricoProduto, iEntradasHistoricoProduto, iLogEstoquesNew, iDadosIniciaisHistoricosProdutos, iOrcamento, iOrcamentoItens, iSaidasHistoricoProduto, iMovAnual } from "./interface"
import moment from "moment";
import Swal from "sweetalert2";


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
    verMaisEntradas: true,
    verMaisSaidas: true,
    verMaisDevolucoes: true,
    verMaisCompras: true,
    verMaisEstoque: true,
    modalHistoricoSaidaOpened: false,
    codProduto: undefined,
    nomeProduto: "",
    loadingDadosIniciais: true,
    loadingEntrada: true,
    loadingSaida: true,
    loadingEstoque: true,
    loadingDevolucao: true,
    loadingCompras: true,
    loadingTextoVendaMeses: true,
})

export const actions = {
    async init(codProduto: number) {
        state.codProduto = codProduto;
        actions.resetValores();
        actions.getEntradaHistoricoProduto();
        actions.getSaidas();
        actions.getCompras();
        actions.getEstoquesNew();
        actions.getDadosIniciais();
        actions.getDevolucoes();
    },


    async onclickCardSaida(saida: iSaidasHistoricoProduto) {

        try {
            state.orcamento = await modalhistoricoProdutoService.getOrcamento(saida.NUM_ORCAMENTO, saida.DATA_VENDA)
            state.orcamentoItens = await modalhistoricoProdutoService.getItensOrcamento(saida.NUM_ORCAMENTO, saida.DATA_VENDA)
            state.modalHistoricoSaidaOpened = true;


        }
        catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao Abrir o histórico de saídas"
            });

        }

    },


    async getEntradaHistoricoProduto() {
        state.loadingEntrada = true
        try {

            const param = { codProduto: state.codProduto, pg: state.pgEntradas }
            const novasEntradas = await modalhistoricoProdutoService.getEntradas(param)

            if (!novasEntradas.length) {
                state.verMaisEntradas = false
                state.loadingEntrada = false
                return
            }


            state.entradas = [...state.entradas, ...novasEntradas]

            state.pgEntradas++


            state.loadingEntrada = false
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as entradas"
            });
        }
    },

    async getSaidas() {
        state.loadingSaida = true
        try {

            const param = { codProduto: state.codProduto, pg: state.pgSaidas }
            const novasSaidas = await modalhistoricoProdutoService.getSaidas(param)

            if (!novasSaidas.length) {
                state.verMaisSaidas = false
                state.loadingSaida = false

                return
            }

            state.saidas = [...state.saidas, ...novasSaidas]

            state.pgSaidas++

            state.loadingSaida = false
        }
        catch (error) {

            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as saídas"
            });

        }
    },

    async getCompras() {
        state.loadingCompras = true
        try {
            const param = { codProduto: state.codProduto, pg: state.pgCompras }
            const novasCompras = await modalhistoricoProdutoService.getCompras(param)

            if (!novasCompras.length) {

                state.verMaisCompras = false
                state.loadingCompras = false
                return
            }

            state.compras = [...state.compras, ...novasCompras]

            state.pgCompras++

            state.loadingCompras = false
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os pedidos"
            });

        }
    },

    async getDevolucoes() {
        state.loadingDevolucao = true
        try {
            const param = { codProduto: state.codProduto, pg: state.pgDevolucoes }
            const novasDevolucoes = await modalhistoricoProdutoService.getDevolucoes(param)

            if (!novasDevolucoes.length) {
                state.verMaisDevolucoes = false
                state.loadingDevolucao = false
                return

            }

            state.devolucoes = [...state.devolucoes, ...novasDevolucoes]

            state.pgDevolucoes++
            state.loadingDevolucao = false
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as devoluções"
            });

        }
    },

    async getDadosIniciais() {
        try {
            const dataInicio = moment();
            const dataFim = moment().subtract(12, 'months');

            const param = {
                codProduto: state.codProduto,
                dataInicio: dataInicio.format('YYYY-MM-DD'),
                dataFim: dataFim.format('YYYY-MM-DD'),
            };

            state.dadosIniciais = await modalhistoricoProdutoService.getDadosIniciais(param);


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
            state.loadingDadosIniciais = false;
            state.loadingTextoVendaMeses = false;

        }
        catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os meses"
            });


        }
    },
    async getEstoquesNew() {
        state.loadingEstoque = true
        try {
            const param = { codProduto: state.codProduto, pg: state.pgEstoques }
            const novosEstoques = await modalhistoricoProdutoService.getLogEstoquesNew(param)

            if (!novosEstoques.length) {
                state.verMaisEstoque = false
                state.loadingEstoque = false
                return
            }

            state.estoques = [...state.estoques, ...novosEstoques]

            state.pgEstoques++
            state.loadingEstoque = false
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar o Estoque"
            });
        }
    },

    resetValores() {
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
        state.loadingDadosIniciais = true;
        state.loadingEntrada = true;
        state.loadingSaida = true;
        state.loadingEstoque = true;
        state.loadingDevolucao = true;
        state.loadingCompras = true;
        state.loadingTextoVendaMeses = true;
    }
}

