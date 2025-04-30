import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import produtosEntreLojasService from "./services/produtosEntreLojas.service";
import { iLojas } from "./interfaces";

export const state = reactive({
    filterSearch: {
        loja: 10,
        mes: moment().month() + 1,
        ano: moment().year()
    },
    loading: false,
    lojas: <iLojas[]>[],
})

export const actions = {
    async init() {
        await actions.getLojas()
    },

    async getLojas() {
        try {
            state.loading = true

            const data = await produtosEntreLojasService.getLojas()

            state.lojas = data

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error ao buscar as lojas.',
                icon: 'error'
            })
        } finally {
            state.loading = false
        }
    }
}