import { computed, reactive } from "vue";
import {
    iCarros,
    iDeleteRequisicaoCompraParam,
    iDeleteRequisicaoComprasItemParam,
    iFavorecido,
    iFinalizarRequisicaoCompraParam,
    iGetRequisicaoCompraItensParam,
    iGetRequisicaoCompraParam,
    iInsertOrUpdateItemParam,
    iInsertRequisicaoCompraParam,
    iMarcas,
    iProduto,
    iItemToEdit,
    iRequisicaoCompra,
    iRequisicaoItem
} from "./interfaces";
import moment from "moment";
import requisicaoCompraService from "./services/requisicaoCompra.service";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";

export const state = reactive({
    dbRequisicaoCompra: <iRequisicaoCompra>{},
    dbRequisicaoItens: <iRequisicaoItem[]>[],
    dbMarcas: <iMarcas[]>[],
    dbCarros: <iCarros[]>[],
    dbItemSelecionado: <iProduto>{},
    dbItemToEdit: <iItemToEdit>{},

    modalNovaRequisicaoOpened: false,
    modalLocalizarRequisicaoOpened: false,
    modalNovoItemOpened: false,
    modalInformarQtdItemOpened: false,
    modalInserirItemSemCadastro: false,

    loading: false,
})

export const actions = {
    async init() {
        await actions.getDadosToSelectProduto()
    },

    async selecionarFavorecido(favorecido: iFavorecido) {

        state.dbRequisicaoCompra = {} as iRequisicaoCompra
        state.dbRequisicaoItens = []

        state.dbRequisicaoCompra = {
            ...state.dbRequisicaoCompra,
            NOME_FAVORECIDO: favorecido.NOME_FAVORECIDO,
            CNPJ_FAVORECIDO: favorecido.CNPJ_FAVORECIDO,
            DATA_HORA_CRIACAO: moment().format('YYYY-MM-DD'),
            FINALIZADO: 'N'
        }

        await actions.insertRequisicaoCompra(favorecido.ID_FAVORECIDO)

        state.modalNovaRequisicaoOpened = false
    },

    async selecionarRequisicaoCompra(requisicao: iRequisicaoCompra) {
        await actions.getRequisicaoCompra(requisicao.ID_REQUISICAO_COMPRA)
        await actions.getRequisicaoComprasItensPorId()

        state.modalLocalizarRequisicaoOpened = false
    },

    async btnDeleteRequisicaoCompra() {
        if (await msgConfirm('Confirmação', 'Deseja excluir esta requisição?')) {
            await actions.deleteRequisicaoCompra();
        }
    },

    async btnFinalizarRequisicaoCompra() {
        if (state.dbRequisicaoItens.length == 0) {
            Swal.fire({
                text: 'É necessário adicionar itens à requisição.',
                icon: 'warning',
            })
            return;
        }

        if (await msgConfirm('Confirmação', 'Deseja finalizar esta requisição?')) {
            await actions.finalizarRequisicaoCompra();
        }
    },

    async openModalInformarQtdItem(item: iProduto) {
        state.dbItemToEdit = null

        state.dbItemSelecionado = item;
        state.modalInformarQtdItemOpened = true;
    },

    async openModalEditarQtdItem(item: iRequisicaoItem) {
        state.dbItemToEdit = {
            ID_REQUISICAO_COMPRA_ITEM: item.ID_REQUISICAO_COMPRA_ITEM,
            COD_PRODUTO: item.COD_PRODUTO,
            QTD: item.QTD,
            VALOR_UNITARIO: item.VALOR_UNITARIO,
            TOTAL: item.TOTAL,
            DESCRICAO: item.DESCRICAO
        }

        state.modalInformarQtdItemOpened = true
    },

    async btnDeleteItem(item: iRequisicaoItem) {
        if (await msgConfirm('Confirmação', 'Deseja excluir este item?')) {
            await actions.deleteRequisicaoComprasItem(item.ID_REQUISICAO_COMPRA_ITEM);
        }
    },

    async getDadosToSelectProduto() {
        try {
            state.loading = true;
            const { marcas, carros } = await requisicaoCompraService.getDadosToSelectProduto();

            state.dbMarcas = marcas;
            state.dbCarros = carros;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao carregar as marcas e carros.",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },

    async insertRequisicaoCompra(idRequisicaoCompra: number) {
        try {
            state.loading = true;

            let param: iInsertRequisicaoCompraParam = {
                ID_FAVORECIDO: idRequisicaoCompra
            }

            const data = await requisicaoCompraService.insertRequisicaoCompra(param);

            state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA = data.ID_REQUISICAO_COMPRA;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao inserir requisição de compra",
                text: error.message
            });
        } finally {
            state.loading = false;
        }
    },

    async getRequisicaoCompra(idRequisicao: number) {
        try {
            state.loading = true;

            let param: iGetRequisicaoCompraParam = {
                ID_REQUISICAO_COMPRA: idRequisicao
            }

            const data = await requisicaoCompraService.getRequisicaoCompra(param);

            state.dbRequisicaoCompra = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao buscar requisição de compra",
                text: error.message
            });
        } finally {
            state.loading = false;
        }
    },

    async deleteRequisicaoCompra() {
        try {
            state.loading = true;

            let param: iDeleteRequisicaoCompraParam = {
                ID_REQUISICAO_COMPRA: state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA
            }

            const data = await requisicaoCompraService.deleteRequisicaoCompra(param);

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: data.msg,
                    showConfirmButton: false,
                    timer: 1500
                });

                state.dbRequisicaoCompra = {} as iRequisicaoCompra;
                state.dbRequisicaoItens = [] as iRequisicaoItem[];
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao excluir requisição de compra",
                text: error.message
            });
        } finally {
            state.loading = false;
        }
    },

    async finalizarRequisicaoCompra() {
        try {
            state.loading = true;

            let param: iFinalizarRequisicaoCompraParam = {
                ID_REQUISICAO_COMPRA: state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA,
                VALOR: state.dbRequisicaoCompra.VALOR
            }

            const data = await requisicaoCompraService.finalizarRequisicaoCompra(param);

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: data.msg,
                    showConfirmButton: false,
                    timer: 1500
                });

                state.dbRequisicaoCompra = {
                    ...state.dbRequisicaoCompra,
                    FINALIZADO: 'S',
                    DATA_HORA_FINALIZADO: moment().format('YYYY-MM-DD HH:mm:ss'),
                    COD_FUNCIONARIO_FINALIZOU: data.codFuncionario,
                    LOGIN_FUNCIONARIO_FINALIZOU: data.loginFuncionario,
                }
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao finalizar requisição de compra",
                text: error.message
            });
        } finally {
            state.loading = false;
        }
    },

    async getRequisicaoComprasItensPorId() {
        try {
            state.loading = true;

            const param: iGetRequisicaoCompraItensParam = {
                ID_REQUISICAO_COMPRA: state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA
            }

            const data = await requisicaoCompraService.getRequisicaoComprasItensPorId(param);

            state.dbRequisicaoItens = data
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao buscar itens da requisição de compra",
                text: error.message
            });

        } finally {
            state.loading = false;
        }
    },

    async insertOrUpdateItem(param: iInsertOrUpdateItemParam) {
        try {
            state.loading = true;

            param.ID_REQUISICAO_COMPRA = state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA;

            await requisicaoCompraService.insertOrUpdateItem(param);

            state.modalNovoItemOpened = false

            await actions.getRequisicaoComprasItensPorId()

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao adicionar o item.",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },

    async deleteRequisicaoComprasItem(idRequisicaoCompraItem: number) {
        try {
            state.loading = true;

            let param: iDeleteRequisicaoComprasItemParam = {
                ID_REQUISICAO_COMPRA_ITEM: idRequisicaoCompraItem
            }

            const data = await requisicaoCompraService.deleteRequisicaoComprasItem(param);

            if (data.success) {
                state.dbRequisicaoItens = state.dbRequisicaoItens.filter(
                    (item: iRequisicaoItem) => item.ID_REQUISICAO_COMPRA_ITEM != idRequisicaoCompraItem
                );

                Swal.fire({
                    icon: "success",
                    title: data.msg,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ocorreu um erro ao excluir o item.",
                text: error.message
            })
        } finally {
            state.loading = false;
        }
    }
}

export const computeds = {
    totalizador: computed(() => {
        if (state.dbRequisicaoItens.length > 0) {
            let valorTotalItens = state.dbRequisicaoItens.reduce((total, item) => total + item.TOTAL, 0)

            state.dbRequisicaoCompra.VALOR = valorTotalItens

            return valorTotalItens
        }

        return 0
    })
}