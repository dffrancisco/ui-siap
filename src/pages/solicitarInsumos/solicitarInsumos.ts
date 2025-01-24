import { useEventListener } from "@vueuse/core";
import moment from "moment";
import { nextTick, reactive } from "vue";
import { iCategoriaComItens, iPedido } from "./interfaces";
import serviceSolicitarInsumos from "./services/solicitarInsumos.service";
import Swal from "sweetalert2";

const ano = moment().year();

export const state = reactive({
    loading: false,
    modalPedidoInsumosOpened: false,
    ano: ano || null || "",
    pedidos: <iPedido[]>[],
    categoriasComItens: <iCategoriaComItens[]>[],
    pedidoSelecionado: null as iPedido | null,
    novoPedido: false,
})

export const actions = {
    async init() {
        await actions.getDadosIniciais();
    },

    novoPedido() {
        state.novoPedido = true;
        state.modalPedidoInsumosOpened = true;
        state.pedidoSelecionado = null;
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

    async getDadosIniciais() {
        try {
            state.loading = true;
            const data = await serviceSolicitarInsumos.getDadosIniciais();
            state.pedidos = data.pedidos;
            state.categoriasComItens = data.categorias;

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados iniciais",
            });
        } finally {
            state.loading = false;
        }
    },

    visualizarPedido(pedido) {
        state.pedidoSelecionado = pedido;
        state.novoPedido = false;
        state.modalPedidoInsumosOpened = true;
    },

    closeModalPedido(itensNoCarrinho) {

        if (state.pedidoSelecionado) {
            state.pedidoSelecionado.itens = itensNoCarrinho
            state.pedidoSelecionado.totalItens = itensNoCarrinho.length;
        }

        if (state.novoPedido == true && itensNoCarrinho.length > 0) {
            actions.getPedidos()
        }

        state.modalPedidoInsumosOpened = false;
    },

    atualizarPedidoFinalizado() {

        if (state.pedidoSelecionado) {
            state.pedidoSelecionado.FINALIZADO = 'S';
        }

        state.modalPedidoInsumosOpened = false;
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