import { reactive } from "vue";
import {
    iFavorecido,
    iGetRequisicaoCompraParam,
    iInsertRequisicaoCompraParam,
    iRequisicaoCompra,
    iRequisicaoItem
} from "./interfaces";
import moment from "moment";
import requisicaoCompraService from "./services/requisicaoCompra.service";
import Swal from "sweetalert2";

export const state = reactive({
    dbRequisicaoCompra: <iRequisicaoCompra>{},
    dbRequisicaoItens: <iRequisicaoItem[]>[],
    modalNovaRequisicaoOpened: false,
    loading: false,
    modalLocalizarRequisicaoOpened: false
})

export const actions = {
    async selecionarFavorecido(favorecido: iFavorecido) {
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
    }
}