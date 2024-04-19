import { computed, reactive } from 'vue'
import comprasItensService from './services/comprasItens.service';
import { swalDarkError, swalDarkWarning } from '@/ts/utils';
import moment from 'moment';
import { MAP_COL_PRODUTO, MAP_COL_ULTIMAS_COMPRAS, MAP_COL_ULTIMAS_VENDAS } from './constants/constants';
import {
    iAbaHistorico,
    iAbaItens,
    iCabecalhoCompra,
    iCarro,
    iHistoricoMes,
    iMarca,
    iObjHistoricoCompraGeral,
    iObjHistoricoVendaGeral,
    iParamEmitAdicionarItem,
    iParamEmitBuscarProdutos,
    iParamInsertItemCompra,
    iProduto,
    iProdutoAdicionadoObj,
    iProdutoObj,
    iTipoVisualizacao
} from './interfaces';

export const state = reactive(({
    loading: true,
    loadingHistoricoVendas: true,
    loadingHistoricoCompras: true,
    loadingProdutosAdicionados: true,
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
    produtosAdicionados: <iProdutoAdicionadoObj>{},
    historicoVendasGeral: <iObjHistoricoVendaGeral>{},
    historicoComprasGeral: <iObjHistoricoCompraGeral>{},
    historicoMesesVenda: <iHistoricoMes[]>[],
    historicoMesesCompra: <iHistoricoMes[]>[],
    abaHistorico: <iAbaHistorico>'vendas',
    abaItens: <iAbaItens>'nao_adicionados',
    tipoVisualizacaoItem: <iTipoVisualizacao>"unica",
    indexProdutoSelecionado: 0,
    qtdMaxItensVistosByMarca: {},
    qtdItensMarca: 0,
    modalAdicionarItemOpened: false,
    indexUltimoItemVisto: 0,
    indexUltimoItemAdicionado: undefined,
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
            actions.buscarProdutosAdicionados(state.idCompras);

            const [dadosIniciais] = await Promise.all([promiseDadosIniciais, promiseProdutos])

            state.cabecalho = dadosIniciais.cabecalho;
            state.carros = dadosIniciais.carros;
            state.marcas = dadosIniciais.marcas;
            state.edtMarca = state.cabecalho.ID_MARCA

            actions.focarNosItens();
        } catch (error) {
            swalDarkError(error?.response?.data.msg || 'Erro ao buscar dados do pedido');
        } finally {
            state.loading = false;
        }
    },

    focarNosItens: () => {
        //@ts-ignore
        document.querySelector('#compras-detalhes').focus();
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

    buscarProdutosAdicionados: async (idCompras: number) => {
        try {
            state.loading = true;
            state.produtosAdicionados = await comprasItensService.getProdutosAdicionados(idCompras);
        } catch (error) {
            swalDarkError('Erro ao buscar produtos adicionados');
        } finally {
            state.loading = false;
        }
    },

    buscarProdutos: async (param: iParamEmitBuscarProdutos) => {

        if (state.loading || state.loadingHistoricoCompras || state.loadingHistoricoVendas) {
            comprasItensService.cancelarRequisicao();
        }

        if (!param.ID_MARCA) {
            return swalDarkWarning('É necessário informar a marca');
        }

        state.loading = true;
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
        if (state.abaItens == 'nao_adicionados') {
            state.indexUltimoItemVisto = state.indexProdutoSelecionado
        }

        if (state.abaItens == 'adicionados') {
            actions.changeIndexProdutoSelecionado(state.indexUltimoItemVisto)
        }

        state.abaItens = abaItens;
    },

    setTipoVisualizacaoItem: (tipoVisualizacaoItem: iTipoVisualizacao) => {
        state.tipoVisualizacaoItem = tipoVisualizacaoItem
    },

    onKeydownContainerPrincipal: (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            actions.onClickVoltarItem()
            e.preventDefault();
            return;
        }

        if (e.key === 'ArrowRight') {
            actions.onClickAvancarItem()
            e.preventDefault();
            return;
        }

        if (e.key === 'Enter') {
            state.modalAdicionarItemOpened = true;
            e.preventDefault();
        }
    },

    onUpdateModalAdicionarItem() {
        setTimeout(() => {
            actions.focarNosItens();
        }, 100);
    },

    changeIndexProdutoSelecionado(index: number) {
        let keyMarca = 'marca:' + state.edtMarca;
        let qtdItensVisitadosMarca = state.qtdMaxItensVistosByMarca[keyMarca] || 1;

        if (state.abaItens == 'nao_adicionados') {
            let indexPosteriorAoSelecionado = index > state.indexProdutoSelecionado;
            let indexPosteriorQtdAtualVista = index > (qtdItensVisitadosMarca - 1)
            if (indexPosteriorAoSelecionado && indexPosteriorQtdAtualVista) {
                state.qtdMaxItensVistosByMarca[keyMarca] = qtdItensVisitadosMarca + 1
            }
        }

        state.indexProdutoSelecionado = index;
    },

    onClickAvancarItem() {
        let keyMarca = 'marca:' + state.edtMarca
        let qtdItensVisitadosMarca = state.qtdMaxItensVistosByMarca[keyMarca] || 1;
        if (state.indexProdutoSelecionado + 1 > qtdItensVisitadosMarca) {
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
    },

    async adicionarItem(param: iParamEmitAdicionarItem) {
        try {
            state.modalAdicionarItemOpened = false;
            state.loading = true;

            let produtoSelecionado = computeds.produtoSelecionado.value

            let codProduto = produtoSelecionado[MAP_COL_PRODUTO.COD_PRODUTO];

            let dadosToInsert: iParamInsertItemCompra = {
                ID_COMPRAS: state.cabecalho.ID_COMPRAS,
                COD_PRODUTO: codProduto,
                CUSTO: param.custo,
                QUANTIDADE: param.qtd,
            }

            let response = await comprasItensService.insertItemCompra(dadosToInsert);

            state.cabecalho.VALOR = response.valorTotalPedido;

            state.produtosAdicionados[codProduto] = {
                ...produtoSelecionado,
                COD_PRODUTO: codProduto,
                PEDIDO_CUSTO_ADICIONADO: param.custo,
                PEDIDO_QTD_ADICIONADA: param.qtd,
            }

            state.indexUltimoItemAdicionado = state.indexProdutoSelecionado

            actions.onClickAvancarItem();
            actions.focarNosItens();
        } catch (error) {
            swalDarkError('erro ao inserir item')
            console.error(error)
        } finally {
            state.loading = false;
        }
    }
}

export const computeds = {
    produtoSelecionado: computed(() => {
        let keyProdutoSelecionado = state.keyProdutos[state.indexProdutoSelecionado];
        return state.produtos[keyProdutoSelecionado] || {} as iProduto;
    }),

    qtdJaAdicionadaItem: computed(() => {
        let keyProdutoSelecionado = state.keyProdutos[state.indexProdutoSelecionado];
        return state.produtosAdicionados[keyProdutoSelecionado]?.PEDIDO_QTD_ADICIONADA || 0
    }),

    ultimoItemAdicionado: computed(() => {
        let keyProdutoSelecionado = state.keyProdutos[state.indexUltimoItemAdicionado];
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
        let historicoCompraProduto = state.historicoComprasGeral[keyProdutoSelecionado]

        if (state.abaHistorico == 'compras' && historicoCompraProduto) {
            let mesesCompras = []
            let historicoMesesCompras = state.historicoComprasGeral[keyProdutoSelecionado].meses

            for (let mes of historicoMesesDefault) {
                mesesCompras.push({
                    ...mes,
                    qtd: historicoMesesCompras[mes.mes.toString() + mes.ano.toString()]?.QTD || 0
                })
            }

            return mesesCompras;
        }

        if (state.abaHistorico == 'vendas' && historicoVendaProduto) {
            let mesesVendas = [];
            let historicoMesesVenda = state.historicoVendasGeral[keyProdutoSelecionado].meses

            for (let mes of historicoMesesDefault) {
                mesesVendas.push({
                    ...mes,
                    qtd: historicoMesesVenda[mes.mes.toString() + mes.ano.toString()]?.QTD || 0
                })
            }

            return mesesVendas;
        }

        return [...historicoMesesDefault]
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
    }),

    ultimasCompras: computed(() => {
        let keyProdutoSelecionado = state.keyProdutos[state.indexProdutoSelecionado]

        if (!keyProdutoSelecionado) {
            return []
        }

        if (!state.historicoComprasGeral[keyProdutoSelecionado]) {
            return []
        }

        return state.historicoComprasGeral[keyProdutoSelecionado].ultimasCompras.sort((a, b) => {
            return a[MAP_COL_ULTIMAS_COMPRAS.POSICAO] - b[MAP_COL_ULTIMAS_COMPRAS.POSICAO]
        })
    }),

    qtdProdutosAdicionados: computed(() => {
        let keys = Object.keys(state.produtosAdicionados)
        return keys.length;
    })
}

export default { state, actions, computeds }