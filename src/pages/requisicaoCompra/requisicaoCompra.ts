import { reactive } from "vue";
import {
    iCarros,
    iDeleteRequisicaoCompraParam,
    iFavorecido,
    iFinalizarRequisicaoCompraParam,
    iGetRequisicaoCompraParam,
    iInsertRequisicaoCompraParam,
    iMarcas,
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
    modalNovaRequisicaoOpened: false,
    loading: false,
    modalLocalizarRequisicaoOpened: false,
    modalNovoItemOpened: false,
    dbMarcas: <iMarcas[]>[],
    dbCarros: <iCarros[]>[],
})

export const actions = {
    async init() {
        await actions.getDadosToSelectProduto()
    },

    async selecionarFavorecido(favorecido: iFavorecido) {

        state.dbRequisicaoCompra = {} as iRequisicaoCompra

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

        state.modalLocalizarRequisicaoOpened = false
    },

    async btnDeleteRequisicaoCompra() {
        if (await msgConfirm('Confirmação', 'Deseja excluir esta requisição?')) {
            await actions.deleteRequisicaoCompra();
        }
    },

    async btnFinalizarRequisicaoCompra() {
        if (await msgConfirm('Confirmação', 'Deseja finalizar esta requisição?')) {
            await actions.finalizarRequisicaoCompra();
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
                ID_REQUISICAO_COMPRA: state.dbRequisicaoCompra.ID_REQUISICAO_COMPRA
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
    }
}