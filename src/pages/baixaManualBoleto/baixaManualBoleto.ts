import { reactive } from "vue";

export const state = reactive({
    modalClienteFaturadoOpened: false,
})

export const actions = {
    async buscarOrcamentosEBoletos() {
        console.log('aqui');
    },
}