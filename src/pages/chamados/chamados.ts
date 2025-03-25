import { reactive } from "vue";
import Swal from "sweetalert2";
import serviceChamados from './services/chamados.service';
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { iChamados, iVerDetalhesChamadoResponse, iParamGetChamados } from "./interfaces";
import utils, { dataBrasil } from "@/ts/utils";

export const state = reactive(({
    solicitante: (""),
    loja: (""),
    assunto: (""),
    descricao: (""),
    anexos: ([]),
    chamados: <iChamados[]>[],
    loading: false,
    totalItems: 0,
    itemsPerPage: 15,
    search: (""),
    headers: [
        {
            title: "Assunto",
            key: "ASSUNTO",
            sortable: false,
            width: "20%",
        },
        {
            title: "Solicitante",
            key: "SOLICITANTE",
            sortable: false,
            width: "20%",
        },
        {
            title: "Data",
            key: "dataFormatada",
            sortable: true,
            width: "20%",
        },
        {
            title: "Identificador",
            key: "KEY_JIRA",
            sortable: false,
            width: "25%",
        },
        {
            title: "Ação",
            key: "ACAO",
            sortable: false,
            width: "17%",
        },

    ],
    detalhes: <iVerDetalhesChamadoResponse>{},
    pnModalDetalhes: <iModalCreate>(<unknown>null),
    imagensChamado: [] as any[],
    cnpj: "",
    keyJira: "",
    grupoEmail: '',
    loginUsuario: "",
    previews: [] as string[],
    anexoModal: [],
    novoComentario: "",
    previewsModal: [] as string[],
}))

export const actions = {

    async init() {
        actions.criarModais();
    },

    resetForm() {
        state.solicitante = '';
        state.loja = '';
        state.assunto = '';
        state.descricao = '';
        state.anexos = [];
        state.previews = [];
    },

    async submitForm() {

        if (!validateForm()) {
            return;
        }

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dataAtual = `${year}-${month}-${day}`;

        const param = {
            solicitante: state.solicitante,
            loja: state.loja,
            assunto: state.assunto,
            descricao: state.descricao.toUpperCase(),
            anexos: state.anexos,
            dataAtual: dataAtual
        };

        try {
            state.loading = true;

            let dadosChamado = await serviceChamados.insertChamado(param)

            const filePaths = await actions.uploadAnexos(dadosChamado.chaveJira, dadosChamado.cnpj);

            if (filePaths) {
                const paramUpdate = {
                    chaveJira: dadosChamado.chaveJira,
                    filePaths,
                    grupoEmail: dadosChamado.grupoEmail
                };
                await actions.updateChamado(paramUpdate);
            }

            actions.getChamados({
                page: 1,
                itemsPerPage: state.itemsPerPage,
                sortBy: null,
                search: state.search,
            });

            Swal.fire({
                icon: "success",
                text: "Chamado cadastrado com sucesso",
            });

            actions.resetForm();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao enviar os dados'
            })
        } finally {
            state.loading = false;
        }
    },

    async getChamados({ page, itemsPerPage, sortBy, search }: iParamGetChamados) {
        try {
            state.loading = true

            const data = await serviceChamados.getChamados({ page, itemsPerPage, sortBy, search });

            state.chamados = data.chamados.map((chamado: iChamados) => ({
                ...chamado,
                dataFormatada: dataBrasil(chamado.DATA_CRIACAO),
            }));
            state.loginUsuario = data.usuario
            state.totalItems = data.total
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir os dados'
            })
        } finally {
            state.loading = false;
        }
    },

    limparStates() {
        state.anexoModal = [];
        state.previewsModal = [];
        state.novoComentario = "";
        state.anexos = [];
        state.previews = [];
    },

    async verDetalhesChamado(keyJira: string, descricao: string, solicitante: string, dataFormatada: string, grupoEmail: string) {
        actions.limparStates()

        try {
            state.loading = true

            const data = await serviceChamados.verDetalhesChamado(keyJira, grupoEmail)

            state.detalhes.responsavel = data.responsavel;
            state.detalhes.descricao = descricao;
            state.detalhes.solicitante = solicitante;
            state.detalhes.dataFormatada = dataFormatada;
            state.detalhes.prioridade = data.prioridade;
            state.detalhes.statusJira = data.statusJira;
            state.detalhes.comentarios = data.comentarios;

            let paramGetImg = {
                keyJira: keyJira,
                cnpj: data.cnpj,
            }

            state.cnpj = data.cnpj.replaceAll(".", "").replaceAll("-", "");
            state.keyJira = keyJira
            state.grupoEmail = grupoEmail
            state.imagensChamado = await serviceChamados.getImgChamado(paramGetImg);

            state.pnModalDetalhes.open();
        } catch (error) {
            Swal.fire({
                icon: 'warning',
                text: error?.response?.data?.msg || "Erro ao buscar os dados do chamado",
            })
        } finally {
            state.loading = false
        }
    },

    criarModais() {
        state.pnModalDetalhes = new xModal.create({
            height: 530,
            width: 650,
            el: '#pnModalDetalhes'
        })
    },

    selecionarAnexos() {
        const fileInputElement = document.getElementById("fileInput") as HTMLInputElement;
        fileInputElement.click();
    },

    adicionarAnexo(event: Event) {
        const fileInputElement = event.target as HTMLInputElement;
        const novosArquivos = Array.from(fileInputElement.files || []);

        novosArquivos.forEach((file) => {
            if (!state.anexos.some((anexo) => anexo.name === file.name && anexo.size === file.size)) {
                state.anexos.push(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        state.previews.push(e.target.result.toString());
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        fileInputElement.value = "";
    },

    removerAnexo(index: number) {
        state.anexos.splice(index, 1);
        state.previews.splice(index, 1);
    },


    async uploadAnexos(chaveJira: string, cnpj: string) {
        const files = state.anexos;

        if (!files.length) {
            return;
        }

        const formData = new FormData();
        formData.append("call", "uploadImg");
        formData.append("cnpj", cnpj);
        formData.append("idChamado", chaveJira);

        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        try {

            const redimensionados = await Promise.all(
                files.map(async (file) => {
                    if (file.type.startsWith("image/")) {
                        return await utils.redimensionarImagem(file, 500);
                    }
                    return file;
                })
            );

            redimensionados.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            let result = await serviceChamados.uploadAnexos(formData);

            if (result.success) {
                return result.files;
            } else {
                throw new Error(result.msg || "Falha no upload dos arquivos");
            }
        } catch (error) {
            console.error("Erro ao enviar os arquivos:", error.message);
        }
    },

    async updateChamado(paramUpdate) {
        try {
            await serviceChamados.updateChamado(paramUpdate)
        } catch (error) {
            console.error("Erro ao fazer update do chamado: " + error);
        }
    },
}

function showValidationError(message: string) {
    Swal.fire({
        icon: 'warning',
        title: 'Preencha os campos obrigatórios',
        text: message,
    });
}

function validateForm() {
    if (!state.assunto || !state.descricao) {
        showValidationError('Verifique os campos obrigatórios');
        return false;
    }
    return true;
}

export default { state, actions }
