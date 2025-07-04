import Swal from "sweetalert2";
import { reactive } from "vue";


export const state = reactive({
    modalAbrirCartoes: false,
})

export const actions = {
    async init() {
    },

    onclickAbrir: () => {
        state.modalAbrirCartoes = true
    }
}
