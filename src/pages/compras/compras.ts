import { computed, reactive } from 'vue'
import comprasService from './services/compras.service'
import {
    iCompra, iMarca, iParamInsertCompra, iParamUpdateCompra,
    iProdutoAdicionadoObj, objMarcasAgrupadas, iTransportadora,
    iDadosImpressao
} from './interfaces'
import moment from 'moment'
import utils, { swalDarkError, swalDarkSuccess } from '../../ts/utils'
import router from '../../router'

const TODAS_AS_MARCAS = 'TODAS AS MARCAS';

export const state = reactive(({
    edtMarca: '',
    compras: <iCompra[]>[],
    marcas: <iMarca[]>[],
    loading: false,
    modalDadosPedidoOpened: false,
    modalImpressaoOpened: false,
    compraAlterar: <iCompra>{},
    nomeMarcaSelecionada: TODAS_AS_MARCAS,
    objProdutosAdicionados: <iProdutoAdicionadoObj>{},
    transportadoras: <iTransportadora[]>[],
    dadosImpressao: <iDadosImpressao>{},
}))

export const actions = {
    init: async () => {
        state.loading = true;
        await actions.getCompras();
        await actions.getMarcas();
        state.loading = false;
    },

    onKeyDown: (event: KeyboardEvent) => {
        if (event.key === 'F1') {
            actions.onClickNovoPedido();
            event.preventDefault();
            return;
        }

        if (event.key === 'F2') {
            //@ts-ignore
            document.querySelector('#edtMarca').focus();
            event.preventDefault();
        }
    },

    getCompras: async () => {
        try {
            let dados = await comprasService.getCompras()
            state.compras = dados;
        } catch (error) {
            swalDarkError('Ocorreu um erro ao buscar as compras')
        }
    },

    getMarcas: async () => {
        try {
            let dados = await comprasService.getMarcas()
            state.marcas = dados;
        } catch (error) {
            swalDarkError('Ocorreu um erro ao buscar as marcas')
        }
    },

    onKeyPressEnterMarca: () => {
        if (marcasAgrupadas.value.length == 1) {
            state.nomeMarcaSelecionada = marcasAgrupadas.value[0].nomeMarca
        }
    },

    onClickNovoPedido: () => {
        state.modalDadosPedidoOpened = true;
    },

    onClickAlterarCompra: (compra: iCompra) => {
        state.compraAlterar = compra;
        state.modalDadosPedidoOpened = true;
    },

    onClickDeletarCompra: (compra: iCompra) => {
        utils.confirmaCodigo({
            msg: 'Deseja realmente deletar o pedido?',
            theme: 'xModal-dark-square',
            call: async () => {
                try {
                    state.loading = true;

                    await comprasService.deleteCompra({ ID_COMPRAS: compra.ID_COMPRAS });

                    let indexCompra = state.compras.findIndex(item => item.ID_COMPRAS == compra.ID_COMPRAS)

                    state.compras.splice(indexCompra, 1);

                    swalDarkSuccess('Compra deletada com sucesso!');
                } catch (error) {
                    swalDarkError(error?.response?.data?.msg || 'Ocorreu um erro ao deletar compra');
                } finally {
                    state.loading = false;
                }
            }
        })
    },

    onClickImprimir: async (compra: iCompra) => {
        state.loading = true;
        try {
            state.objProdutosAdicionados = await comprasService.getProdutosAdicionados(compra.ID_COMPRAS);
        } catch (error) {
            swalDarkError(error?.response?.data?.msg || 'Ocorreu um erro ao buscar itens do pedido')
        } finally {
            state.loading = false;
        }

        if (state.transportadoras.length == 0) {
            try {
                state.transportadoras = await comprasService.getTransportadoras();
            } catch (error) {
                swalDarkError(error?.response?.data?.msg || 'Ocorreu um erro ao buscar transportadoras')
            } finally {
                state.loading = false;
            }
        }

        state.dadosImpressao.NOME_MARCA = compra.NOME_MARCA;
        state.dadosImpressao.OBSERVACAO = compra.OBS || '';
        state.dadosImpressao.NUM_PEDIDO = compra.ID_COMPRAS;
        state.modalImpressaoOpened = true;
    },

    closeModalDadosPedido: () => {
        state.modalDadosPedidoOpened = false;
        state.compraAlterar = {} as iCompra;
    },

    closeModalImpressao: () => {
        state.modalImpressaoOpened = false;
        state.objProdutosAdicionados = {} as iProdutoAdicionadoObj;
    },

    redirectToItensdoPedido: (idCompras: number, idMarca: number) => {
        router.push({
            name: "comprasItens",
            query: {
                idCompras,
                idMarca
            },
        });
    },

    insertCompra: async (param: iParamInsertCompra) => {
        try {
            state.loading = true

            const { ID_COMPRAS, ID_MARCA } = await comprasService.insertCompra(param);

            actions.closeModalDadosPedido();

            actions.redirectToItensdoPedido(ID_COMPRAS, ID_MARCA);

        } catch (error) {
            swalDarkError(error?.response?.data?.msg || 'Ocorreu um erro ao inserir compra');
        } finally {
            state.loading = false;
        }
    },

    updateCompra: async (param: iParamUpdateCompra) => {
        try {
            state.loading = true

            await comprasService.updateCompra(param);

            actions.closeModalDadosPedido();

            let indexCompra = state.compras.findIndex(compra => compra.ID_COMPRAS == param.ID_COMPRAS)

            state.compras[indexCompra] = {
                ...state.compras[indexCompra],
                ...param
            }

            swalDarkSuccess('Pedido alterado com sucesso!')

        } catch (error) {
            swalDarkError(error?.response?.data?.msg || 'Ocorreu um erro ao inserir compra');
        } finally {
            state.loading = false;
        }
    },
}

export const comprasFiltradas = computed(() => {
    if (state.nomeMarcaSelecionada == TODAS_AS_MARCAS) {
        return state.compras
    }

    return state.compras.filter(compra => {
        return compra.NOME_MARCA.toLocaleLowerCase() == state.nomeMarcaSelecionada.toLocaleLowerCase() ? true : false
    })
})

export const marcasAgrupadas = computed(() => {
    let objMarcasAgrupadas: objMarcasAgrupadas = {}
    objMarcasAgrupadas[TODAS_AS_MARCAS] = {
        nomeMarca: TODAS_AS_MARCAS,
        qtd: 0,
        valor: 0,
        selecionada: true,
    }

    state.compras.forEach(compra => {
        if (objMarcasAgrupadas[compra.NOME_MARCA] == undefined) {
            objMarcasAgrupadas[compra.NOME_MARCA] = {
                qtd: 0,
                valor: 0,
                nomeMarca: compra.NOME_MARCA,
                selecionada: false,
            }
        }

        objMarcasAgrupadas[compra.NOME_MARCA].qtd++;
        objMarcasAgrupadas[compra.NOME_MARCA].valor += compra.VALOR

        objMarcasAgrupadas[TODAS_AS_MARCAS].qtd++;
        objMarcasAgrupadas[TODAS_AS_MARCAS].valor += compra.VALOR;
    })

    let marcas = Object.values(objMarcasAgrupadas)
        .sort((marcaA, marcaB) => {
            return marcaB.valor - marcaA.valor
        });

    if (state.edtMarca) {
        marcas = marcas.filter(marca => marca.nomeMarca.toLocaleLowerCase().indexOf(state.edtMarca.toLocaleLowerCase()) > -1)
    }

    return marcas
})

export const valorPendente = computed(() => {
    let valorTotal = 0
    comprasFiltradas.value.forEach(compra => valorTotal += compra.VALOR)

    return valorTotal;
})

export const qtdPedidosMaisDe20Dias = computed(() => {
    let pedidos = comprasFiltradas.value.filter(compra => {
        let dataPedido = compra.DATA
        let dataLimite = moment(dataPedido).add(20, 'days');
        return moment().isAfter(dataLimite) ? true : false;
    })

    return pedidos.length;
})

export default { state, actions }