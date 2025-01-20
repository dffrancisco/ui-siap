import { useEventListener } from "@vueuse/core";
import moment from "moment";
import { nextTick, reactive } from "vue";
import { iPedidosInsumos } from "./interfaces";
import serviceSolicitarInsumos from "./services/solicitarInsumos.service";
import Swal from "sweetalert2";


const ano = moment().year();

export const state = reactive({
    loading: false,
    modalNovoPedidoInsumosOpened: false,
    ano: ano || null || "",
    pedidos: <iPedidosInsumos[]>[],
    pedidoSelecionado: null as iPedidosInsumos | null,
    novoPedido: false
})

export const actions = {
    async init() {
        actions.getPedidos();
    },

    novoPedido() {
        state.novoPedido = true;
        state.modalNovoPedidoInsumosOpened = true;
    },

    async getPedidos() {

        if (state.ano === "" || state.ano > ano.toString()) {
            Swal.fire({
                icon: "warning",
                text: "Insira um ano válido para continuar"
            });
            return
        }


        try {
            state.loading = true;

            const data = await serviceSolicitarInsumos.getPedidos(state.ano);
            state.pedidos = data;
        } catch (error) {

        } finally {
            state.loading = false;
        }
    },

    visualizarPedido(pedido) {
        state.pedidoSelecionado = pedido;
        state.novoPedido = false;
        state.modalNovoPedidoInsumosOpened = true;
    },

    closeModalNovoPedido() {
        state.modalNovoPedidoInsumosOpened = false;
        state.pedidoSelecionado = null;
        actions.getPedidos();
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