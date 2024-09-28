import { reactive } from "vue";

export const teste = true

export const state = reactive({
    prazos: {
        prazoDiasAte1: '0',
        prazoDiasAte2: '0',
        prazoDiasAte3: '0',
        prazoDiasAcimaDe1: '0',
        prazoDiasAcimaDe2: '0',
        prazoDiasAcimaDe3: '0',
    },
    loading: false,
    btnAlterarActivated: false,
    isReadonly: false,
})

export const actions = {

}