import { reactive } from "vue";
import cabongoOrcamentoService from "./service/cabongoOrcamento.service";


export const state = reactive({
    orcamentoLoja: []
})

export const actions = {
    async init() {

    },

    async getOrcamentoLoja() {
        state.orcamentoLoja = await cabongoOrcamentoService.getOrcamentoLoja()
    }

}