import { reactive } from "vue";
import { iClientes, iParamRequisicoes, iTabs } from "./interfaces";
import moment from "moment";
import serviceConsultaCliente from "./services/consultaCliente.service"
import Swal from "sweetalert2";

export const state = reactive({
    loading: false,
    modalLocalizarClienteOpened: false,
    dataInicio: moment().startOf("month").format("YYYY-MM-DD"),
    dataFim: moment().format("YYYY-MM-DD"),
    tab: <iTabs>{},
    clienteSelecionado: <iClientes>{},
    cliente: "",
    telefone: "",
    cnpj: "",
    observacao: "",
    idCliente: 0
})

export const actions = {

    closeModalLocalizarCliente() {
        state.modalLocalizarClienteOpened = false;
    },

    selecionarCliente(clienteSelecionado: iClientes, dataInicio, dataFim) {
        state.clienteSelecionado = clienteSelecionado;
        actions.popularInputs(clienteSelecionado, dataInicio, dataFim)
    },

    popularInputs(clienteSelecionado, dataInicio, dataFim) {
        state.dataInicio = dataInicio;
        state.dataFim = dataFim;
        state.cliente = clienteSelecionado.NOME
        state.telefone = clienteSelecionado.TELEFONE1
        state.cnpj = clienteSelecionado.CGC_CLIENTE
        state.observacao = clienteSelecionado.OBS
        state.idCliente = clienteSelecionado.ID_CLIENTE

        actions.requisicoesCliente()
    },

    async requisicoesCliente() {
        try {
            state.loading = true;
            let param: iParamRequisicoes = {
                idCliente: state.idCliente,
                dataInicio: state.dataInicio,
                dataFim: state.dataFim
            }

            const data = await serviceConsultaCliente.requisicoesDadosCliente(param);

        } catch (error) {
            const errorMessage = error.response?.data?.msg || "Erro ao buscar os dados.";
            Swal.fire({
                icon: "error",
                text: errorMessage
            });
            return;
        } finally {
            state.loading = false;
        }
    }
}