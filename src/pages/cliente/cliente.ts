import { reactive } from "vue";
import { iClientes } from "./interfaces";

export const state = reactive({
    loading: false,
    modalClienteOpened: false,
    cnpj: "",
    cpf: "",
    razaoSocial: "",
    inscricaoEstadual: "",
    telefone: "",
    telefoneAdicional: "",
    email: "",
    emailParaBoletos: "",
    contatoFinanceiro: "",
    contatoCompras: "",
    obsAdministrativo: "",
    obsVendas: "",
    cep: "",
    endereco: "",
    bairro: "",
    cidade: "",
    uf: "",
    atividadeCnae: "",
    clienteSelecionado: <iClientes>{},
})

export const actions = {
    selecionarCliente(clienteSelecionado: iClientes) {
        state.clienteSelecionado = clienteSelecionado;
        actions.popularInputs(clienteSelecionado)
    },

    popularInputs(clienteSelecionado) {
        // state.dataInicio = dataInicio;
        // state.dataFim = dataFim;
        // state.cliente = clienteSelecionado.NOME
        // state.telefone = clienteSelecionado.TELEFONE1
        // state.cnpj = clienteSelecionado.CGC_CLIENTE
        // state.observacao = clienteSelecionado.OBS
        // state.idCliente = clienteSelecionado.ID_CLIENTE

        // actions.requisicoesCliente()
    },

}