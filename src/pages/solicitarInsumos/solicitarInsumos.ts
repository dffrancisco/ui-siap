import { useEventListener } from "@vueuse/core";
import moment from "moment";
import { nextTick, reactive } from "vue";

const ano = moment().year();

export const state = reactive({
    loading: false,
    modalNovoPedidoInsumosOpened: false,
    ano: ano || null,
})

export const actions = {
    novoPedido() {
        state.modalNovoPedidoInsumosOpened = true;
    }
}

export const eventListener = useEventListener(document, "keydown", async (event) => {

    if (event.key === "F2") {

        nextTick(() => {
            actions.novoPedido()
        });

        event.preventDefault();
        event.stopPropagation();
    }
});