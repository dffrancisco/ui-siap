import Swal from "sweetalert2";
import { reactive } from "vue";


export const state = reactive({
    loading: false,
    modalAbrirCartoes: false,
})

export const actions = {
    async init() {
    },

    onclickAbrir: () => {
        state.loading = true
        state.modalAbrirCartoes = true
    }
}
