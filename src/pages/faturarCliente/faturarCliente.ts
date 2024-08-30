import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { reactive } from "vue";
import { iClienteFaturado } from "./interfaces";

export const state = reactive({
    gridPedido: <ixGridCreate>{},
    dataLimite: moment().format('YYYY-MM-DD'),
    modalSelecionarClienteOpened: false,
    dbClienteFaturado: <iClienteFaturado>{}
})

export const actions = ({
    async init() {
        actions.criarGrid()
    },

    criarGrid() {
        state.gridPedido = new xGridV2.create({
            el: "#gridPedido",
            count: true,
            columns: {
                'Orç.': {},
                'Nota Fiscal': {},
                'Cliente': {},
                'Data': {},
                'Devolução': {},
                'Valor': {}
            },

        })
    },

    closeModal() {
        state.modalSelecionarClienteOpened = false
    },

    selecionarCliente(cliente: iClienteFaturado) {
        state.dbClienteFaturado = cliente
    }
})