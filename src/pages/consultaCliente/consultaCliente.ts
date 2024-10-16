import { reactive } from "vue";
import { iTabs } from "./interfaces";

export const state = reactive({
    loading: false,
    modalLocalizarClienteOpened: false,
    tab: <iTabs>{},
})

export const actions = {

    openModalLocalizarCliente() {
        state.modalLocalizarClienteOpened = true;
    },

    closeModalLocalizarCliente() {
        state.modalLocalizarClienteOpened = false;
    },
}