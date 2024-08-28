import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";

export const state = reactive({
    gridPedido: <ixGridCreate>{}
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
    }
})