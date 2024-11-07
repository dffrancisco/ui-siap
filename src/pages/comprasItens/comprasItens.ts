import { computed, nextTick, reactive } from 'vue'
import comprasItensService, { getColorQtdEstoque } from './services/comprasItens.service';
import utils, { sleep, swalDarkError, swalDarkWarning } from '@/ts/utils';
import moment from 'moment';
import { MAP_COL_PRODUTO, MAP_COL_ULTIMAS_COMPRAS, MAP_COL_ULTIMAS_VENDAS } from './constants/constants';
import {
    iAbaHistorico,
    iAbaItens,
    iCabecalhoCompra,
    iCarro,
    iHistoricoMes,
    iItemComErro,
    iItemFila,
    iMarca,
    iObjHistoricoCompraGeral,
    iObjHistoricoVendaGeral,
    iParamEmitAdicionarItem,
    iParamEmitBuscarProdutos,
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
    idCompras: <number | undefined>undefined,
    cabecalho: <iCabecalhoCompra>{},
    carros: <iCarro[]>[],
    marcas: <iMarca[]>[],
    edtNumFabricante: undefined,
    edtDescricao: undefined,
    edtCarro: undefined,
    edtMarca: <number | undefined>undefined,
    produtos: <iProdutoObj>{},
    keyProdutosOrigem: <string[]>[],
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
    indexUltimoItemVisto: 0,
    indexUltimoItemAdicionado: undefined,
    filaItens: <iItemFila[]>[],
    persistindoItem: false,
    modalImpressaoOpened: false,
    transportadoras: [],
    ordenarPor: <'nenhum' | 'num_fabricante' | 'descricao'>'nenhum',
    modalItensErroOpen: false,
    itensComErro: <iItemComErro[]>[],
    historicoErro: false,
    isAlteracao: false,
    menuConfigOpened: false,
    verTodosOsItens: false,
    verVendasEComprasEntreLojas: false
}))

setInterval(async () => {

    if (state.persistindoItem) return;

    if (state.filaItens.length == 0) return;

    let item = state.filaItens[0];

    if (item.TENTATIVAS > 3) {
        state.filaItens.push(item);
        state.filaItens.splice(0, 1);
        return;
    }

    if (item.ACAO == 'ADD' && item.TENTATIVAS <= 3) {
        state.persistindoItem = true;
        await actions.persistirItemFilaADD(item, 0);
        state.persistindoItem = false;
    }

    if (item.ACAO == 'REM' && item.TENTATIVAS <= 3) {
        state.persistindoItem = true;
        await actions.persistirItemFilaREM(item, 0);
        state.persistindoItem = false;
    }

}, 1000);

const getLast12Months = () => {
    const nomeMeses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const result = [] as iHistoricoMes[];

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

        state.verTodosOsItens = JSON.parse(localStorage.getItem('verTodosOsItens'))
        state.verVendasEComprasEntreLojas = JSON.parse(localStorage.getItem('verVendasEComprasEntreLojas'))

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
            state.edtMarca = state.cabecalho.ID_MARCA;
            state.transportadoras = dadosIniciais.transportadoras;
            actions.focarNosItens();
        } catch (error) {
            swalDarkError(error?.response?.data.msg || 'Erro ao buscar dados do pedido');
        } finally {
            state.loading = false;
        }
    },

    async abrirModalImpressao() {
        state.modalImpressaoOpened = true;
    },

    fecharModalImpressao() {
        state.modalImpressaoOpened = false;
    },

    setOrdenar(label: 'num_fabricante' | 'descricao') {
        actions.changeIndexProdutoSelecionado(0)

        if (state.ordenarPor == label) {
            state.keyProdutos = state.keyProdutosOrigem
            state.ordenarPor = 'nenhum';
            return;
        }

        state.ordenarPor = label

        if (state.ordenarPor == 'num_fabricante') {
            state.keyProdutos = computeds.keysOrdenadasPorNumFabricante.value
        } else if (state.ordenarPor == 'descricao') {
            state.keyProdutos = computeds.keysOrdenadasPorDescricao.value
        } else {
            state.keyProdutos = state.keyProdutosOrigem
        }
    },

    focarNosItens: () => {
        //@ts-ignore
        document.querySelector('#compras-detalhes').focus();
    },

    buscarHistorico: async (param: iParamEmitBuscarProdutos) => {
        state.historicoErro = false

        await actions.buscarHistoricoVendas(param);
        await actions.buscarHistoricoCompras(param);
    },

    buscarHistoricoVendas: async (param: iParamEmitBuscarProdutos) => {
        try {
            state.loadingHistoricoVendas = true;
            state.historicoVendasGeral = await comprasItensService.getHistoricoVendas(param);
        } catch (error) {
            if (error.__CANCEL__) return;
            state.historicoErro = true
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
            state.historicoErro = true
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

        param.VER_TODOS_OS_ITENS = state.verTodosOsItens

        state.loading = true;
        state.indexProdutoSelecionado = 0;
        state.abaItens = 'nao_adicionados';

        try {
            actions.buscarHistorico(param);

            const response = await comprasItensService.getProdutos(param)

            state.qtdItensMarca = response.qtdItensMarca

            state.edtMarca = param.ID_MARCA;
            state.produtos = response.produtos;
            state.keyProdutosOrigem = Object.keys(state.produtos);
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

    async focarContainerItem() {
        state.abaItens = 'nao_adicionados';
        await nextTick();
        await sleep(100);
        // @ts-ignore
        document.querySelector("#containerItem").focus();
    },

    onKeydownContainerPrincipal: async (e: KeyboardEvent) => {
        if (state.abaItens == 'nao_adicionados' && state.tipoVisualizacaoItem == 'unica') {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === '3') {
                actions.onClickVoltarItem()
                e.preventDefault();
                return;
            }

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === '1') {
                actions.onClickAvancarItem()
                e.preventDefault();
                return;
            }
        }

        if (e.key == 'F1') {
            let elemento = document.getElementById('edtNumFabricante') as HTMLInputElement
            elemento.select();
            e.preventDefault();
            return;
        }

        if (e.key == 'F2') {
            let elemento = document.getElementById('edtDescricao') as HTMLInputElement
            elemento.select();
            e.preventDefault();
            return;
        }

        if (e.key == 'F3') {
            let elemento = document.getElementById('edtCarro')
            elemento.click();
            e.preventDefault();
            return;
        }

        if (e.key == 'F6') {
            let elemento = document.getElementById('edtMarca')
            elemento.click();
            e.preventDefault();
            return;
        }

        if (e.altKey && (e.key == 'A' || e.key == 'a')) {
            state.abaItens = 'adicionados';
            e.preventDefault();
            return;
        }

        if (e.altKey && (e.key == 'I' || e.key == 'i')) {
            actions.focarContainerItem();
            e.preventDefault();
            return;
        }

        if (e.altKey && (e.key == 'M' || e.key == 'm')) {
            if (state.tipoVisualizacaoItem == 'lista') {
                actions.setTipoVisualizacaoItem('unica')
                actions.focarContainerItem();
            } else {
                actions.setTipoVisualizacaoItem('lista')
            }

            e.preventDefault();
            return;
        }

        if (e.altKey && (e.key == 'V' || e.key == 'v')) {
            actions.setAbaHistorico('vendas')
            e.preventDefault();
            return;
        }

        if (e.altKey && (e.key == 'C' || e.key == 'c')) {
            actions.setAbaHistorico('compras')
            e.preventDefault();
            return;
        }

        if (e.altKey && (e.key == 'P' || e.key == 'p')) {
            actions.abrirModalImpressao();
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

    addItemFila(item: iItemFila) {
        let indexItemNaFila = state.filaItens.findIndex(i => i.COD_PRODUTO == item.COD_PRODUTO);

        if (indexItemNaFila == -1) {
            state.filaItens.push(item);
            localStorage.setItem(`siap:comprasItens-${item.ID_COMPRAS}`, JSON.stringify(state.filaItens));
        } else {
            state.filaItens[indexItemNaFila].TENTATIVAS = 0;
        }
    },

    async persistirItemFilaADD(item: iItemFila, indexFilaItem: number) {
        try {
            let response = await comprasItensService.insertItemCompra({
                COD_PRODUTO: item.COD_PRODUTO,
                CUSTO: item.CUSTO,
                QUANTIDADE: item.QUANTIDADE,
                ID_COMPRAS: item.ID_COMPRAS,
            });

            state.cabecalho.VALOR = response.valorTotalPedido;

            actions.removerItemFila(item.ID_COMPRAS, indexFilaItem)
        } catch (error) {
            item.TENTATIVAS++;
            actions.addItemComErro({
                COD_PRODUTO: item.COD_PRODUTO,
                ERRO_MSG: utils.getErrorMessage(error),
                ACAO: item.ACAO,
                DESC_PRODUTO: item.DESC_PRODUTO,
                NUM_FABRICANTE: item.NUM_FABRICANTE,
                TENTATIVAS: item.TENTATIVAS
            })
            console.error('erro ao persistir dados do item: ', item.COD_PRODUTO)
        }
    },

    async persistirItemFilaREM(item: iItemFila, indexFilaItem: number) {
        try {
            state.loading = true;

            let response = await comprasItensService.deleteItemCompra({ ID_COMPRAS: item.ID_COMPRAS, COD_PRODUTO: item.COD_PRODUTO });

            state.cabecalho.VALOR = response.valorTotalPedido;

            actions.removerItemFila(item.ID_COMPRAS, indexFilaItem)
        } catch (error) {
            item.TENTATIVAS++;
            actions.addItemComErro({
                COD_PRODUTO: item.COD_PRODUTO,
                ERRO_MSG: utils.getErrorMessage(error),
                ACAO: item.ACAO,
                DESC_PRODUTO: item.DESC_PRODUTO,
                NUM_FABRICANTE: item.NUM_FABRICANTE,
                TENTATIVAS: item.TENTATIVAS
            })
            swalDarkError(error?.response?.data?.msg || "Ocorreu um erro ao deletar o item");
        } finally {
            state.loading = false;
        }
    },

    removerItemFila(idCompras: number, indexFilaItem: number) {
        state.filaItens.splice(indexFilaItem, 1);

        if (state.filaItens.length > 0) {
            localStorage.setItem(`siap:comprasItens-${idCompras}`, JSON.stringify(state.filaItens));
        } else {
            localStorage.removeItem(`siap:comprasItens-${idCompras}`);
        }
    },

    async adicionarItem(param: iParamEmitAdicionarItem) {
        try {
            state.loading = true;

            state.isAlteracao = false

            let produtoSelecionado = computeds.produtoSelecionado.value

            let codProduto = produtoSelecionado[MAP_COL_PRODUTO.COD_PRODUTO]
            let descProduto = produtoSelecionado[MAP_COL_PRODUTO.DESC_PRODUTO]
            let numFabricante = produtoSelecionado[MAP_COL_PRODUTO.NUM_FABRICANTE]

            actions.addItemFila({
                ID_COMPRAS: state.cabecalho.ID_COMPRAS,
                COD_PRODUTO: codProduto,
                CUSTO: param.custo,
                QUANTIDADE: param.qtd,
                ACAO: 'ADD',
                TENTATIVAS: 0,
                DESC_PRODUTO: descProduto,
                NUM_FABRICANTE: numFabricante
            })

            state.isAlteracao = param.isAlteracao
            await nextTick()

            state.produtosAdicionados[codProduto] = {
                ...produtoSelecionado,
                COD_PRODUTO: codProduto,
                PEDIDO_CUSTO_ADICIONADO: param.custo,
                PEDIDO_QTD_ADICIONADA: param.qtd,
            }

            if (state.abaItens == 'nao_adicionados') {
                state.indexUltimoItemAdicionado = state.indexProdutoSelecionado
                actions.onClickAvancarItem();
            }

            actions.focarNosItens();
        } catch (error) {
            swalDarkError('erro ao inserir item')
            console.error(error)
        } finally {
            state.loading = false;
        }
    },

    async deletarItem(codProduto: number) {
        let produtoSelecionado = state.produtosAdicionados[codProduto]

        let numFabricante = produtoSelecionado[MAP_COL_PRODUTO.NUM_FABRICANTE]
        let descProduto = produtoSelecionado[MAP_COL_PRODUTO.DESC_PRODUTO]

        actions.addItemFila({
            ID_COMPRAS: state.cabecalho.ID_COMPRAS,
            COD_PRODUTO: codProduto,
            CUSTO: 0,
            QUANTIDADE: 0,
            ACAO: 'REM',
            TENTATIVAS: 0,
            DESC_PRODUTO: descProduto,
            NUM_FABRICANTE: numFabricante
        })

        let keysProdutosSelecionados = Object.keys(state.produtosAdicionados)
        let indexProdutoSelecionado = keysProdutosSelecionados.findIndex(key => parseInt(key) == codProduto);

        delete state.produtosAdicionados[codProduto];
        await nextTick()

        let keyNextItem = keysProdutosSelecionados[indexProdutoSelecionado + 1]

        state.indexProdutoSelecionado = state.keyProdutos.findIndex(key => key == keyNextItem);
    },

    openCloseModalItensErro() {
        if (computeds.contadorItens.value.qtdErro == 0 && !state.modalItensErroOpen) {
            return
        }

        state.modalItensErroOpen = !state.modalItensErroOpen;
    },

    async addItemComErro(item: iItemComErro) {
        let itemComErroExistente = state.itensComErro.find(i => i.COD_PRODUTO == item.COD_PRODUTO);

        if (!itemComErroExistente) {
            state.itensComErro.push(item);
        }
    },

    async removerItemComErro(codProduto: number) {
        let indexItemComErro = state.itensComErro.findIndex(item => item.COD_PRODUTO == codProduto);
        if (indexItemComErro > -1) {
            state.itensComErro.splice(indexItemComErro, 1);
        }
    },

    async tentarInserirItemComErroNovamente(codProduto: number) {
        await actions.removerItemComErro(codProduto)

        let indexFilaItem = state.filaItens.findIndex(item => item.COD_PRODUTO == codProduto);

        if (indexFilaItem != -1) {
            state.filaItens[indexFilaItem].TENTATIVAS = 0;
        }
    },

    async btnVerTodosOsItens() {
        state.verTodosOsItens = !state.verTodosOsItens

        localStorage.setItem('verTodosOsItens', JSON.stringify(state.verTodosOsItens))

        await actions.buscarProdutos({ ID_MARCA: state.edtMarca })

        state.qtdMaxItensVistosByMarca = {}
    },

    btnVerVendasEComprasEntreLojas() {
        state.verVendasEComprasEntreLojas = !state.verVendasEComprasEntreLojas
        localStorage.setItem('verVendasEComprasEntreLojas', JSON.stringify(state.verVendasEComprasEntreLojas))
    },
}

export const computeds = {
    keysOrdenadasPorNumFabricante: computed(() => {
        return Object.keys(state.produtos).sort((a, b) => {
            const fabricanteA = state.produtos[a][MAP_COL_PRODUTO.NUM_FABRICANTE];
            const fabricanteB = state.produtos[b][MAP_COL_PRODUTO.NUM_FABRICANTE];
            return fabricanteA.localeCompare(fabricanteB);
        });
    }),

    keysOrdenadasPorDescricao: computed(() => {
        return Object.keys(state.produtos).sort((a, b) => {
            const fabricanteA = state.produtos[a][MAP_COL_PRODUTO.DESC_PRODUTO];
            const fabricanteB = state.produtos[b][MAP_COL_PRODUTO.DESC_PRODUTO];
            return fabricanteA.localeCompare(fabricanteB);
        });
    }),

    produtoSelecionado: computed(() => {
        let keyProdutoSelecionado = state.keyProdutos[state.indexProdutoSelecionado]
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
            let mesesCompras = [] as iHistoricoMes[]
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
            let mesesVendas = [] as iHistoricoMes[];
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

        let vendasFiltradas = state.historicoVendasGeral[keyProdutoSelecionado].ultimasVendas;
        if (!state.verVendasEComprasEntreLojas) {
            vendasFiltradas = vendasFiltradas.filter(venda => venda[MAP_COL_ULTIMAS_VENDAS.MESMO_GRUPO] !== 1);
        }

        return vendasFiltradas.sort((a, b) =>
            a[MAP_COL_ULTIMAS_VENDAS.POSICAO] - b[MAP_COL_ULTIMAS_VENDAS.POSICAO]
        );
    }),

    ultimasCompras: computed(() => {
        let keyProdutoSelecionado = state.keyProdutos[state.indexProdutoSelecionado]

        if (!keyProdutoSelecionado) {
            return []
        }

        if (!state.historicoComprasGeral[keyProdutoSelecionado]) {
            return []
        }

        let comprasFiltradas = state.historicoComprasGeral[keyProdutoSelecionado].ultimasCompras;
        if (!state.verVendasEComprasEntreLojas) {
            comprasFiltradas = comprasFiltradas.filter(compra => compra[MAP_COL_ULTIMAS_VENDAS.MESMO_GRUPO] !== "1");
        }

        return comprasFiltradas.sort((a, b) =>
            a[MAP_COL_ULTIMAS_COMPRAS.POSICAO] - b[MAP_COL_ULTIMAS_COMPRAS.POSICAO]
        );
    }),

    mediaQtdItemSelecionado: computed(() => {
        let produtoSelecionado = computeds.produtoSelecionado.value

        if (!produtoSelecionado[MAP_COL_PRODUTO.COD_PRODUTO]) return 0

        let ultimosTresMeses = computeds.historicoMeses.value.slice(1, 4)

        let soma = 0;
        for (let mes of ultimosTresMeses) {
            soma += mes.qtd
        }

        return Math.round(soma / 3)
    }),

    corMediaVenda: computed(() => {
        return getColorQtdEstoque(computeds.mediaQtdItemSelecionado.value, computeds.produtoSelecionado.value[MAP_COL_PRODUTO.QUANTIDADE])
    }),

    contadorItens: computed(() => {
        let qtdItensFila = state.filaItens.length;
        let qtdItensFilaSemErro = state.filaItens.filter(item => item.TENTATIVAS == 0).length
        let qtdItensFilaErro = qtdItensFila - qtdItensFilaSemErro
        let qtdProdutosAdicionados = Object.keys(state.produtosAdicionados).length;

        return {
            qtdProdutosAdicionados: qtdProdutosAdicionados - qtdItensFila,
            qtdProcessando: qtdItensFilaSemErro,
            qtdErro: qtdItensFilaErro,
        }
    }),

    marcasPedido: computed(() => {
        let marcas = [];

        let produtosAdicionadosArray = Object.values(state.produtosAdicionados);
        let grupoMarcas = Object.groupBy(produtosAdicionadosArray, item => item[MAP_COL_PRODUTO.DESCRICAO_MARCA]);
        let nomeMarcas = Object.keys(grupoMarcas);

        marcas.push(...nomeMarcas)

        return marcas
    }),

    disablePrint: computed(() => {
        if (computeds.contadorItens.value.qtdErro > 0) {
            return true;
        }

        if (computeds.contadorItens.value.qtdProcessando > 0) {
            return true;
        }

        return false;
    })
}

export default { state, actions, computeds }