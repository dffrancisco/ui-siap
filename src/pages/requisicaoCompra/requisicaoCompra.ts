import { reactive } from "vue";
import { iRequisicaoCompra, iRequisicaoItem } from "./interfaces";

export const state = reactive({
    dbRequisicaoCompra: <iRequisicaoCompra>{},
    dbRequisicaoItens: <iRequisicaoItem[]>[],
    modalNovaRequisicaoOpened: false,
    loading: false
})

export const actions = {

}