import { reactive } from "vue";
import Swal from "sweetalert2";
import serviceChamados from './services/chamados.service';
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { iChamados, iVerDetalhesChamadoResponse, iParamGetChamados, iInsertChamado } from "./interfaces";
import { dataBrasil } from "@/ts/utils";
import moment from "moment";

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
            sortable: true,
        },
        {
            title: "Solicitante",
            key: "SOLICITANTE",
            sortable: true,
        },
        {
            title: "Data",
            key: "dataFormatada",
            sortable: true,
        },
        {
            title: "Ação",
            key: "ACAO",
            sortable: false,
        },
    ],
    detalhes: <iVerDetalhesChamadoResponse>{},
    pnModalDetalhes: <iModalCreate>(<unknown>null),
    imagensChamado: "",
    cnpj: "",
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

            let paramUpdate = {
                descricao: state.descricao,
                chaveJira: dadosChamado.chaveJira,
                filePaths
            }

            await actions.updateChamado(paramUpdate);

            Swal.fire({
                icon: 'success',
                text: 'Chamado cadastrado com sucesso'
            })

            actions.resetForm()
            actions.getChamados({ page: 1, itemsPerPage: state.itemsPerPage, sortBy: null, search: state.search });
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

    async verDetalhesChamado(keyJira: string, descricao: string, solicitante: string, dataFormatada: string) {

        try {
            state.loading = true

            const data = await serviceChamados.verDetalhesChamado(keyJira)

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
            state.imagensChamado = await serviceChamados.getImgChamado(paramGetImg);

            state.pnModalDetalhes.open();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao buscar os dados do chamado.'
            })
        } finally {
            state.loading = false
        }
    },

    criarModais() {
        state.pnModalDetalhes = new xModal.create({
            height: 550,
            width: 600,
            el: '#pnModalDetalhes'
        })
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
                        return await actions.redimensionarImagem(file, 500);
                    }
                    return file;
                })
            );

            redimensionados.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });


            // await serviceChamados.uploadAnexos(formData);

            let result = await serviceChamados.uploadAnexos(formData);

            if (result.success) {
                console.log("Arquivos enviados:", result.files);
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

    async redimensionarImagem(file: File, maxSizeKB: number): Promise<File> {
        const maxSizeBytes = maxSizeKB * 1024;

        if (file.size <= maxSizeBytes) {
            return file;
        }

        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        return new Promise<File>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                img.src = reader.result as string;
            };
            reader.onerror = reject;

            img.onload = () => {
                const ratio = Math.sqrt(maxSizeBytes / file.size);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name, {
                                type: file.type,
                            });
                            resolve(newFile);
                        } else {
                            reject(new Error("Erro ao criar Blob da imagem redimensionada."));
                        }
                    },
                    file.type,
                    0.9
                );
            };
            img.onerror = reject;
            reader.readAsDataURL(file);
        });
    }


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
