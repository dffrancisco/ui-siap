import { useEventListener } from "@vueuse/core";
import moment from "moment";
import { nextTick, reactive } from "vue";
import { iCategorias, iPedidosInsumos } from "./interfaces";
import serviceSolicitarInsumos from "./services/solicitarInsumos.service";
import Swal from "sweetalert2";

const ano = moment().year();

export const state = reactive({
    loading: false,
    modalNovoPedidoInsumosOpened: false,
    ano: ano || null || "",
    pedidos: <iPedidosInsumos[]>[],
    categorias: <iCategorias[]>[],
    pedidoSelecionado: null as iPedidosInsumos | null,
    novoPedido: false
})

export const actions = {
    async init() {
        actions.getPedidos();
        actions.getCategorias();
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

    async getCategorias() {
        try {
            state.loading = true;
            const data = await serviceSolicitarInsumos.getCategorias();
            state.categorias = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar as categorias",
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    visualizarPedido(pedido) {
        state.pedidoSelecionado = pedido;
        state.novoPedido = false;
        state.modalNovoPedidoInsumosOpened = true;
    },

    closeModalNovoPedido(itensNoCarrinho) {

        if (state.pedidoSelecionado) {
            state.pedidoSelecionado.itens = itensNoCarrinho
            state.pedidoSelecionado.totalItens = itensNoCarrinho.length;
        } else {
            actions.getPedidos();
        }

        state.modalNovoPedidoInsumosOpened = false;
        state.pedidoSelecionado = null;
    },

    atualizarPedidoFinalizado() {

        if (state.pedidoSelecionado) {
            state.pedidoSelecionado.FINALIZADO = 'S';
        }

        state.modalNovoPedidoInsumosOpened = false;
        state.pedidoSelecionado = null;
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