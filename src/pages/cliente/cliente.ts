import { nextTick, reactive, ref } from "vue";
import { iAtividadesCNAE, iBairros, iCidades, iClientes, iUF } from "./interfaces";
import serviceCliente from "./services/cliente.service";
import Swal from "sweetalert2";
import { useEventListener } from "@vueuse/core";

export const state = reactive({
    loading: false,
    modalClienteOpened: false,
    boletoEmail: 0,
    cnpj_cpf: "",
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
    apelido: "",
    bairros: <iBairros[]>[],
    selectBairro: "",
    cidades: <iCidades[]>[],
    selectCidade: "",
    ufs: <iUF[]>[],
    selectUF: "",
    atividadeCNAE: <iAtividadesCNAE[]>[],
    clienteSelecionado: <iClientes>{},
    inputCNPJ_CPF: <HTMLInputElement>null,
    desativarInputs: true,
    desativarBtns: true,
})

export const actions = {
    async init() {
        actions.getDadosParaInputs()
        state.inputCNPJ_CPF = document.getElementById('inputCNPJ_CPF') as HTMLInputElement
    },

    async getDadosParaInputs() {
        try {
            state.loading = true;
            const data = await serviceCliente.getDadosParaInputs();
            state.bairros = data.bairros
            state.cidades = data.cidades
            state.ufs = data.ufs
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados iniciais!"
            });
        } finally {
            state.loading = false;
        }
    },


    selecionarCliente(clienteSelecionado: iClientes) {
        state.clienteSelecionado = clienteSelecionado;
        actions.popularInputs(clienteSelecionado)
    },

    popularInputs(clienteSelecionado: iClientes) {
        state.cnpj_cpf = clienteSelecionado.CGC_CLIENTE;
        state.razaoSocial = clienteSelecionado.NOME;
        state.inscricaoEstadual = clienteSelecionado.INSC_ESTADUAL;
        state.telefone = clienteSelecionado.TELEFONE1;
        state.telefoneAdicional = clienteSelecionado.TELEFONE2;
        state.email = clienteSelecionado.EMAIL;
        state.emailParaBoletos = clienteSelecionado.EMAIL_FOR_BOLETO;
        state.contatoFinanceiro = clienteSelecionado.CONT_FINANCEIRO;
        state.contatoCompras = clienteSelecionado.CONT_COMPRAS;
        state.obsAdministrativo = clienteSelecionado.OBS;
        state.obsVendas = clienteSelecionado.OBS_VENDAS;
        state.cep = clienteSelecionado.CEP;
        state.endereco = clienteSelecionado.ENDERECO;
        state.apelido = clienteSelecionado.APELIDO;
        state.atividadeCNAE = clienteSelecionado.ATIVIDADE_CNAE
        state.boletoEmail = clienteSelecionado.BOLETO_EMAIL
        state.selectBairro = clienteSelecionado.BAIRRO;
        state.selectCidade = clienteSelecionado.CIDADE;
        state.selectUF = clienteSelecionado.UF;
        state.desativarBtns = false;
    },

    novoCliente() {
        if (state.clienteSelecionado.ID_CLIENTE) {
            actions.limparInputs()
        }

        state.desativarBtns = false;
        state.desativarInputs = false;
        nextTick(() => {
            state.inputCNPJ_CPF.focus();
        });
    },

    editarDadosCliente() {
        state.desativarInputs = false;
        if (!state.clienteSelecionado.ID_CLIENTE) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum cliente foi selecionado!"
            });
            return;
        }
        nextTick(() => {
            state.inputCNPJ_CPF.focus();
        });
    },

    deletarCliente() {
        if (!state.clienteSelecionado.ID_CLIENTE) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum cliente foi selecionado!"
            });
            return;
        }
    },

    cancelar() {
        state.desativarInputs = true;
        state.desativarBtns = true;
        actions.limparInputs();
    },

    limparInputs() {
        state.cnpj_cpf = "";
        state.razaoSocial = "";
        state.inscricaoEstadual = "";
        state.telefone = "";
        state.telefoneAdicional = "";
        state.email = "";
        state.emailParaBoletos = "";
        state.contatoFinanceiro = "";
        state.contatoCompras = "";
        state.obsAdministrativo = "";
        state.obsVendas = "";
        state.cep = "";
        state.endereco = "";
        state.selectBairro = "";
        state.selectCidade = "";
        state.selectUF = "";
        state.clienteSelecionado = <iClientes>{};
    },

    visualizarCNAE(atividade) {
        const tipoAtividade = atividade.ATIVIDADE == "P" ? "Principal" : "Secundária";
        const mensagem = `
          <strong>CNAE:</strong> ${atividade.CNAE}<br>
          <strong>Tipo de Atividade:</strong> ${tipoAtividade}<br>
          <strong>Descrição:</strong> ${atividade.DESC_ATIVIDADE}
        `;

        Swal.fire({
            icon: "info",
            title: "Detalhes da Atividade CNAE",
            html: mensagem,
            confirmButtonText: "Fechar"
        });
    },

    validarInsert() {

        if (!state.cnpj_cpf) {
            Swal.fire({
                icon: "warning",
                text: "Data Inválida!"
            });
            return false;
        }

        actions.insertNovoCliente();


    },

    insertNovoCliente() {

    }
}

export const eventListener = useEventListener(document, "keydown", async (event) => {
    if (!state.modalClienteOpened) {
        if (event.key === "F1") {
            const button = document.getElementById("btnGetClientes");
            button.click();
            event.preventDefault();
            event.stopPropagation();
        }

        if (event.key === "F2") {
            const button = document.getElementById("btnNovoCliente");
            button.click();
            event.preventDefault();
            event.stopPropagation();
        }
    }
});