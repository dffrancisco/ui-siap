import { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { reactive } from "vue";

export const state = reactive({
    loading: false,
    gridPrincipal: <ixGridCreate>{},
    search: "",
    modalLiberarCliente: <iModalCreate>{},
    modalLiberarClienteOpened: false,
})

export const actions = {

    init() {
        actions.criarModal()
    },

    criarModal() {
        state.modalLiberarCliente = new xModal.create({
            el: "#modalLiberarCliente",
            height: 370,
            width: 700,
            theme: 'xModal-blue',
            onOpen: () => { state.modalLiberarClienteOpened = true },
            onClose: () => { state.modalLiberarClienteOpened = false }
        })
    },

    modalLiberarClienteClose() {
        state.modalLiberarCliente.close();
    },

    openModalLiberarCliente() {
        state.modalLiberarCliente.open();
    },

    selecionarCliente() {

    }
}