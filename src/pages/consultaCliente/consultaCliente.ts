import moment from "moment";
import { reactive } from "vue";
import { iTabs } from "./interfaces";

export const state = reactive({
    loading: false,
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    inputDataFinal: <HTMLInputElement>{},
    modalLocalizarClienteOpened: false,
    tab: <iTabs>{},
})

export const actions = {

    closeModalLocalizarCliente() {
        state.modalLocalizarClienteOpened = false;
    },
}