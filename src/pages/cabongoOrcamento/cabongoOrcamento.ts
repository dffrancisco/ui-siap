import { reactive } from "vue";
import cabongoOrcamentoService from "./service/cabongoOrcamento.service";

export const state = reactive({
    orcamentosLoja: {},
    objOrcamentoLoja: [],
    id_sociedade: 0,
    meuCNPJ: '',
    dataOrcamento: ''
})

export const actions = {
    async init() {
        actions.getOrcamentoLoja()
    },

    async getOrcamentoLoja() {
        state.orcamentosLoja = await cabongoOrcamentoService.getOrcamentoLoja({
            id_sociedade: state.id_sociedade,
            cnpj: state.meuCNPJ,
            dataOrcamento: state.dataOrcamento
        })
    }

}