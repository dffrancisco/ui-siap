import { computed, reactive } from 'vue'
import { iAbaHistorico, iAbaItens, iCabecalhoCompra, iCarro, iHistoricoMes, iMarca, iObjHistoricoCompraGeral, iObjHistoricoVendaGeral, iParamEmitBuscarProdutos, iProduto, iProdutoObj, iTipoVisualizacao, iUltimaCompra, iUltimaVenda } from './interfaces';
import comprasItensService from './services/comprasItens.service';
import { swalDarkError } from '@/ts/utils';
import moment from 'moment';
import { MAP_COL_ULTIMAS_VENDAS } from './constants/constants';

export const state = reactive(({
    loading: true,
    loadingHistoricoVendas: true,
    loadingHistoricoCompras: true,
    idCompras: undefined,
    cabecalho: <iCabecalhoCompra>{},
    carros: <iCarro[]>[],
    marcas: <iMarca[]>[],
    edtNumFabricante: undefined,
    edtDescricao: undefined,
    edtCarro: undefined,
    edtMarca: undefined,
    produtos: <iProdutoObj>{},
    keyProdutos: <string[]>[],
    historicoVendasGeral: <iObjHistoricoVendaGeral>{},
    historicoComprasGeral: <iObjHistoricoCompraGeral>{},
    historicoMesesVenda: <iHistoricoMes[]>[],
    historicoMesesCompra: <iHistoricoMes[]>[],
    ultimasCompras: <iUltimaCompra[]>[
        { NUM_NOTA: 123, DATA: '2024-01-03', FORNECEDOR: 'FULANINHO DA SILVA FERREIRAAAAA AAA', QTD: 520, CUSTO: 200.5, VENDA: 401, MESMO_GRUPO: 0 },
        { NUM_NOTA: 123, DATA: '2024-01-03', FORNECEDOR: 'FULANINHO DA SILVA FERREIRA', QTD: 5, CUSTO: 200.5, VENDA: 401, MESMO_GRUPO: 0 },
        { NUM_NOTA: 123, DATA: '2024-01-03', FORNECEDOR: 'FULANINHO DA SILVA FERREIRA', QTD: 5, CUSTO: 200.5, VENDA: 401, MESMO_GRUPO: 1 },
        { NUM_NOTA: 123, DATA: '2024-01-03', FORNECEDOR: 'FULANINHO DA SILVA FERREIRA', QTD: 5, CUSTO: 200.5, VENDA: 401, MESMO_GRUPO: 0 },
        { NUM_NOTA: 123, DATA: '2024-01-03', FORNECEDOR: 'FULANINHO DA SILVA FERREIRA', QTD: 5, CUSTO: 200.5, VENDA: 401, MESMO_GRUPO: 0 },
    ],
    abaHistorico: <iAbaHistorico>'vendas',
    abaItens: <iAbaItens>'nao_adicionados',
    tipoVisualizacaoItem: <iTipoVisualizacao>"unica",
    indexProdutoSelecionado: 0,
    qtdMaxItensVistosByMarca: {},
    qtdItensMarca: 0,
}))

const getLast12Months = () => {
    const nomeMeses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const result = [];

    for (let i = 0; i < 12; i++) {
        const date = moment().subtract(i, 'months');
        const nomeMes = nomeMeses[date.month()];

        result.unshift({ mesExtenso: nomeMes, mes: date.month() + 1, ano: date.year(), qtd: 0 });
    }

    return result.reverse();
}

const historicoMesesDefault = getLast12Months();

export const actions = {
    init: async () => {
        state.historicoMesesVenda = [...historicoMesesDefault]
        state.historicoMesesCompra = [...historicoMesesDefault]

        state.loading = true;

        try {
            const promiseDadosIniciais = comprasItensService.getDadosIniciais({
                ID_COMPRAS: state.idCompras
            })

            const promiseProdutos = actions.buscarProdutos({ ID_MARCA: state.edtMarca })

            const [dadosIniciais] = await Promise.all([promiseDadosIniciais, promiseProdutos])

            state.cabecalho = dadosIniciais.cabecalho;
            state.carros = dadosIniciais.carros;
            state.marcas = dadosIniciais.marcas;
            state.edtMarca = state.cabecalho.ID_MARCA
        } catch (error) {
            swalDarkError(error?.response?.data.msg || 'Erro ao buscar dados do pedido');
        } finally {
            state.loading = false;
        }
    },

    buscarHistoricoVendas: async (param: iParamEmitBuscarProdutos) => {
        try {
            state.loadingHistoricoVendas = true;
            state.historicoVendasGeral = await comprasItensService.getHistoricoVendas(param);
        } catch (error) {
            if (error.__CANCEL__) return;
            swalDarkError('Erro ao buscar histórico de vendas');
        } finally {
            state.loadingHistoricoVendas = false;
        }
    },

    buscarHistoricoCompras: async (param: iParamEmitBuscarProdutos) => {
        try {
            state.loadingHistoricoCompras = true;
            state.historicoComprasGeral = await comprasItensService.getHistoricoCompras(param);
        } catch (error) {
            if (error.__CANCEL__) return;
            swalDarkError('Erro ao buscar histórico de compras');
        } finally {
            state.loadingHistoricoCompras = false;
        }
    },

    buscarProdutos: async (param: iParamEmitBuscarProdutos) => {

        if (state.loading || state.loadingHistoricoCompras || state.loadingHistoricoVendas) {
            console.log('aquiiii');
            comprasItensService.cancelarRequisicao();
        }

        state.loading = true;
        console.log('uiiii');
        state.indexProdutoSelecionado = 0;

        if (param.ID_MARCA != state.edtMarca) {
            let keyMarca = 'marca:' + state.edtMarca
            state.qtdMaxItensVistosByMarca[keyMarca] = 1
        }

        try {
            actions.buscarHistoricoVendas(param)
            actions.buscarHistoricoCompras(param)

            const response = await comprasItensService.getProdutos(param)

            state.edtMarca = param.ID_MARCA;
            state.produtos = response.produtos;
            state.qtdItensMarca = response.qtdItensMarca;
            state.keyProdutos = Object.keys(state.produtos);
        } catch (error) {
            if (error.__CANCEL__) return;
            swalDarkError(error?.response?.data.msg || 'Erro ao buscar produtos');
        } finally {
            state.loading = false;
        }
    },

    setAbaHistorico: (abaHistorico: iAbaHistorico) => {
        state.abaHistorico = abaHistorico;
    },

    setAbaItens: (abaItens: iAbaItens) => {
        state.abaItens = abaItens;
    },

    setTipoVisualizacaoItem: (tipoVisualizacaoItem: iTipoVisualizacao) => {
        state.tipoVisualizacaoItem = tipoVisualizacaoItem
    },

    onClickAvancarItem() {
        let keyMarca = 'marca:' + state.edtMarca
        let qtdItensVisitadosMarca = state.qtdMaxItensVistosByMarca[keyMarca] || 1;
        if (state.indexProdutoSelecionado + 1 >= qtdItensVisitadosMarca) {
            state.qtdMaxItensVistosByMarca[keyMarca] = qtdItensVisitadosMarca + 1
        }

        if (state.indexProdutoSelecionado < state.keyProdutos.length - 1) {
            state.indexProdutoSelecionado += 1
        }
    },

    onClickVoltarItem() {
        if (state.indexProdutoSelecionado > 0) {
            state.indexProdutoSelecionado -= 1
        }
    }
}

export const computeds = {
    produtoSelecionado: computed(() => {
        let keyProdutoSelecionado = state.keyProdutos[state.indexProdutoSelecionado];
        return state.produtos[keyProdutoSelecionado] || {} as iProduto;
    }),

    exibirIconeAvancar: computed(() => {
        return state.indexProdutoSelecionado < state.keyProdutos.length - 1 ? true : false
    }),

    exibirIconeVoltar: computed(() => {
        return state.indexProdutoSelecionado > 0 ? true : false
    }),

    progressoNavegacaoItens: computed(() => {
        return state.qtdMaxItensVistosByMarca['marca:' + state.edtMarca] * 100 / (state.qtdItensMarca - 1)
    }),

    historicoMeses: computed(() => {
        let keyProdutoSelecionado = state.keyProdutos[state.indexProdutoSelecionado]

        if (!keyProdutoSelecionado) {
            return historicoMesesDefault
        }

        let historicoVendaProduto = state.historicoVendasGeral[keyProdutoSelecionado]

        let mesesVendas = [...historicoMesesDefault]
        let mesesCompras = [...historicoMesesDefault]

        if (state.abaHistorico == 'compras') {
            return state.historicoMesesCompra
        }

        if (state.abaHistorico == 'vendas' && historicoVendaProduto) {
            let historicoMesesVenda = state.historicoVendasGeral[keyProdutoSelecionado].meses

            for (let mes of mesesVendas) {
                mes.qtd = historicoMesesVenda[mes.mes.toString() + mes.ano.toString()]?.QTD || 0
            }

            return mesesVendas;
        }

        return historicoMesesDefault
    }),

    ultimasVendas: computed(() => {
        let keyProdutoSelecionado = state.keyProdutos[state.indexProdutoSelecionado]

        if (!keyProdutoSelecionado) {
            return []
        }

        if (!state.historicoVendasGeral[keyProdutoSelecionado]) {
            return []
        }

        return state.historicoVendasGeral[keyProdutoSelecionado].ultimasVendas.sort((a, b) => {
            return a[MAP_COL_ULTIMAS_VENDAS.POSICAO] - b[MAP_COL_ULTIMAS_VENDAS.POSICAO]
        })
    })
}

export default { state, actions, computeds }