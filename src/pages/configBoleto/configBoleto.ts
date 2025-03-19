import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceConfigBoleto from "./services/configBoleto.service"


export const state = reactive({
    loading: false,
})

export const actions = {
    init() {
        actions.getDadosIniciaisConfigBoleto()
    },

    async getDadosIniciaisConfigBoleto() {
        try {
            state.loading = true;

            let dadosConfigBoleto = await serviceConfigBoleto.getDadosIniciaisConfigBoleto();
            console.log(dadosConfigBoleto);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar as informações de configuração do boleto",
            });
        } finally {
            state.loading = false;
        }
    },

}