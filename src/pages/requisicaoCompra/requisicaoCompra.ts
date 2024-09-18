import { reactive } from "vue";
import { iRequisicaoCompra, iRequisicaoItem } from "./interfaces";
import moment from "moment";

export const state = reactive({
    dbRequisicaoCompra: <iRequisicaoCompra>{},
    dbRequisicaoItens: <iRequisicaoItem[]>[]
})