import { reactive } from "vue";

export const state = reactive({
    prazoDiasDe: {

    },
    prazoDiasAte: [
        24, 39, 54
    ],
    loading: false,
})

export const actions = {
    teste(teste) {
        state.prazoDiasAte = [teste]
    }
}