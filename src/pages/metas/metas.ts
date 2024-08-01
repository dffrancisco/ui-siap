import { reactive } from "vue";
import metasService from './services/metas.service'
import globalState from '../../store/globalState'
import Swal from "sweetalert2";
import { iGetMetasTracadaParam, iGetValoresParam } from "./interfaces";

export const state = reactive({
    loaging: false
})

export const actions = {
    async init() {
        // await actions.getMetasTracadas()
        // await actions.getValores()
    },

    async getMetasTracadas() {
        try {
            state.loaging = true

            let param: iGetMetasTracadaParam = {
                data: '2024-06-28',
                cnpj: globalState.empresa.CGC_EMPRESA
            }

            await metasService.getMetasTracada(param)

        } catch (erro) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as metas traçadas."
            })
        } finally {
            state.loaging = false
        }
    },

    async getValores() {
        try {
            state.loaging = true

            let param: iGetValoresParam = {
                data: '2024-06-28',
                noturno: 'S'
            }

            await metasService.getValores(param)

        } catch (erro) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os valores."
            })
        } finally {
            state.loaging = false
        }
    }
}

export const computeds = {

}