import { nextTick, reactive, ref } from "vue";
import { iAtividadesCNAE, iBairros, iCidades, iClientes, iUF } from "./interfaces";
import serviceCliente from "./services/cliente.service";
import Swal from "sweetalert2";
import { useEventListener } from "@vueuse/core";
import utils from "@/ts/utils";

export const state = reactive({
    apelido: "",
    atividadeCNAE: <iAtividadesCNAE[]>[],
    bairros: <iBairros[]>[],
    bloqueado: 0,
    boletoEmail: 0,
    cep: "",
    cidades: <iCidades[]>[],
    clienteSelecionado: <iClientes>{},
    cnpjMode: true,
    contatoCompras: "",
    contatoFinanceiro: "",
    cnpj_cpf: "",
    desativarInputs: true,
    desativarBtns: true,
    email: "",
    emailParaBoletos: "",
    endereco: "",
    faturado: 1,
    idCliente: <number>null,
    inscricaoEstadualOuIdentidade: "",
    inputCNPJ_CPF: <HTMLInputElement>null,
    loading: false,
    modalClienteOpened: false,
    mesmoGrupo: 0,
    obsAdministrativo: "",
    obsVendas: "",
    pjOuPf: "",
    razaoSocial: "",
    selectBairro: <number>null,
    selectCidade: <number>null,
    selectUF: <string>"",
    telefone: "",
    telefoneAdicional: "",
    ufs: <iUF[]>[],
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
        actions.popularStates(clienteSelecionado)
    },

    popularStates(clienteSelecionado: iClientes) {
        console.log(clienteSelecionado);
        state.cnpj_cpf = clienteSelecionado.CGC_CLIENTE;
        state.razaoSocial = clienteSelecionado.NOME;
        state.inscricaoEstadualOuIdentidade = clienteSelecionado.INSC_ESTADUAL;
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
        state.selectBairro = clienteSelecionado.ID_BAIRRO;
        state.selectCidade = clienteSelecionado.COD_CIDADE;
        state.selectUF = clienteSelecionado.UF;
        state.mesmoGrupo = clienteSelecionado.MESMO_GRUPO;
        state.pjOuPf = clienteSelecionado.PJ_OU_PF;
        state.bloqueado = clienteSelecionado.BLOQUEADO;
        state.faturado = clienteSelecionado.FATURADO;
        state.idCliente = clienteSelecionado.ID_CLIENTE
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
        state.inscricaoEstadualOuIdentidade = "";
        state.telefone = "";
        state.telefoneAdicional = "";
        state.email = "";
        state.emailParaBoletos = "";
        state.contatoFinanceiro = "";
        state.contatoCompras = "";
        state.obsAdministrativo = "";
        state.boletoEmail = 0;
        state.obsVendas = "";
        state.cep = "";
        state.apelido = "";
        state.endereco = "";
        state.selectBairro = null;
        state.selectCidade = null;
        state.selectUF = "";
        state.atividadeCNAE = <iAtividadesCNAE[]>[];
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

    validarInsertOuUpdate() {

        const CPF_CNPJ_Valido = utils.validaCPF_CNPJ(state.cnpj_cpf);
        if (!CPF_CNPJ_Valido) {
            Swal.fire({
                icon: "warning",
                text: state.cnpjMode ? "CNPJ inválido!" : "CPF inválido!",
            });
            return false;
        }

        //F = CLIENTE FISICO, T = CLIENTE JURIDICO
        state.pjOuPf = state.cnpjMode ? "T" : "F";
        const camposObrigatorio = [
            { field: state.cnpj_cpf, name: "CNPJ/CPF" },
            { field: state.razaoSocial, name: "Razão Social" },
            { field: state.inscricaoEstadualOuIdentidade, name: "Inscrição Estadual/Identidade" },
            { field: state.endereco, name: "Endereço" },
            { field: state.selectCidade, name: "Cidade" },
            { field: state.selectBairro, name: "Bairro" },
            { field: state.cep, name: "CEP" },
        ];

        for (const item of camposObrigatorio) {
            if (!item.field) {
                Swal.fire({
                    icon: "warning",
                    text: `${item.name} é obrigatório!`,
                });
                return false;
            }
        }

        actions.insertOuUpdateCliente();
        return true;
    },

    async insertOuUpdateCliente() {
        state.loading = true;

        const param = {
            APELIDO: state.apelido,
            BOLETO_EMAIL: state.boletoEmail,
            BLOQUEADO: state.bloqueado,
            CEP: state.cep,
            CEP_COR: state.cep,
            CGC_CLIENTE: state.cnpj_cpf,
            COD_CIDADE: state.selectCidade,
            COD_CIDADE_COR: state.selectCidade,
            CONT_COMPRAS: state.contatoCompras,
            CONT_FINANCEIRO: state.contatoFinanceiro,
            EMAIL: state.email,
            EMAIL_FOR_BOLETO: state.emailParaBoletos,
            ENDERECO: state.endereco,
            ENDERECO_COR: state.endereco,
            FATURADO: state.faturado,
            FISICA: state.pjOuPf,
            ID_BAIRRO: state.selectBairro,
            ID_BAIRRO_COR: state.selectBairro,
            ID_CLIENTE: state.idCliente,
            INSC_ESTADUAL_OU_IDENTIDADE: state.inscricaoEstadualOuIdentidade,
            MESMO_GRUPO: state.mesmoGrupo,
            NOME: state.razaoSocial,
            OBS: state.obsAdministrativo,
            OBS_VENDAS: state.obsVendas,
            TELEFONE1: state.telefone,
            TELEFONE2: state.telefoneAdicional,
            UF: state.selectUF,
        }

        console.log(param);
        try {
            await serviceCliente.insertOuUpdateCliente(param);

            Swal.fire({
                icon: "success",
                title: "Cliente atualizado com sucesso.",
                showConfirmButton: false,
                timer: 1000,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao inserir cliente.",
            });
        } finally {
            state.loading = false;
        }

    },

    async preencherEndereco() {
        const cep = state.cep.replace("-", "");
        if (cep.length !== 8) {
            Swal.fire({
                icon: "warning",
                text: "CEP inválido!",
            });
            return;
        }

        const enderecoData = await actions.buscarEnderecoPorCEP(cep);

        if (enderecoData) {
            state.endereco = enderecoData.logradouro;
            state.selectUF = enderecoData.uf;

            const tratarStringBairroCidade = (str: string) =>
                str
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-zA-Z0-9\s]/g, "")
                    .toUpperCase()
                    .trim();

            const extrairTexto = (str: string): string | null => {
                const match = str.match(/\(([^)]+)\)/);
                return match ? match[1] : null;
            };

            const enderecoBairro = tratarStringBairroCidade(enderecoData.bairro);
            const bairroDentroParenteses = extrairTexto(enderecoData.bairro);
            const enderecoCidade = tratarStringBairroCidade(enderecoData.localidade);

            const bairroEncontrado = state.bairros.find((bairro) => {
                const bairroNormalizado = tratarStringBairroCidade(bairro.DESCRICAO);

                if (bairroDentroParenteses) {
                    const textoParentesesNormalizado = tratarStringBairroCidade(bairroDentroParenteses);
                    if (bairroNormalizado.includes(textoParentesesNormalizado)) {
                        return true;
                    }
                }
                return bairroNormalizado.includes(enderecoBairro);
            });

            const cidadeEncontrada = state.cidades.find((cidade) =>
                tratarStringBairroCidade(cidade.DESCRICAO).includes(enderecoCidade)
            );

            state.selectBairro = bairroEncontrado ? bairroEncontrado.ID_BAIRRO : null;
            state.selectCidade = cidadeEncontrada ? cidadeEncontrada.COD_CIDADE : null;
        }
    },

    async buscarEnderecoPorCEP(cep: string) {
        try {
            state.loading = true;
            let response = await serviceCliente.buscarCEP(cep);
            console.log(response);
            if (response.data.erro) {
                Swal.fire({
                    icon: "error",
                    text: "CEP não encontrado!",
                });
                return null;
            }
            return response.data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar o CEP.",
            });
            return null;
        } finally {
            state.loading = false;
        }
    },

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

        if (event.key === "F3") {
            state.cnpjMode = !state.cnpjMode;
            // actions.limparInputs()
            event.preventDefault();
            event.stopPropagation();
        }
    }
});