import { reactive } from "vue";
import { iClientesFaturados } from "./interfaces";
import Swal from "sweetalert2";
import serviceBaixaManualBoleto from "./services/baixaManualBoleto.service";

export const state = reactive({
    modalClienteFaturadoOpened: false,
    clienteFaturadoSelecionado: <iClientesFaturados>{},
    nomeClienteFaturadoSelecionado: '',
    loading: false,
})

export const actions = {

    async salvarClienteFaturadoSelecionado(clienteFaturadoSelecionado: iClientesFaturados) {
        state.clienteFaturadoSelecionado = clienteFaturadoSelecionado;
        state.nomeClienteFaturadoSelecionado = clienteFaturadoSelecionado.CLIENTE;

        await actions.getOrcamentosEBoletosEmAberto()
    },


    async getOrcamentosEBoletosEmAberto() {
        try {
            state.loading = true;
            let param = {
                CNPJ: state.clienteFaturadoSelecionado.CNPJ,
                ID_CLIENTE: state.clienteFaturadoSelecionado.ID_CLIENTE,
            }

            let response = await serviceBaixaManualBoleto.getOrcamentosEBoletosEmAberto(param);

            return response.data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os orçamentos e boletos do cliente.",
            });
            return;
        } finally {
            state.loading = false;
        }


    }

}