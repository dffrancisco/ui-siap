import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import printJS from "print-js";
import { computed, reactive, watch } from "vue";
import stateLogin from "../../login/login";
import {
    iDeletarArquivo,
    iDeletarDocumento,
    iDeletarFalta,
    iFaltaFeriadoFolga,
} from "../interface";
import gerenciarFolhaPontoDetalhesService from "./../services/gerenciarFolhaPontoDetalhes.service";
import Swal from "sweetalert2";
import { confirmaCodigo } from "@/ts/utils";

const TIPO_FERIADO = 7
const TIPO_DIA_FOLGA = 5
const TIPO_EM_OUTRA_LOJA = 13
const TIPO_ATRASO_JUSTIFICADO = 14

export const setup = (emit: any, props: any) => {

    const state = reactive({
        loading: false,
        justificativa: null,
        selectedCID: null,
        showCIDAutocomplete: false,
        hideButtons: false,
        status: null,
        selectedTipoFalta: null,
        modalQrCode: <iModalCreate>(<unknown>null),
        modalQrCodeOpened: false,
        inserirFalta: <unknown>null,
        dadosDocumento: props.dadosDocumento,
    });

    watch(
        () => props.opened,
        () => {
            if (props.opened) {
                state.loading = true;
                state.selectedTipoFalta = props.pontos.TIPO;
                state.justificativa = props.pontos.STATUS;
                state.showCIDAutocomplete = false;
                state.loading = false;
            }
        }
    );

    let desabilitarJustificativa = computed(() => {
        if (state.selectedTipoFalta == null || state.selectedTipoFalta == undefined) {
            return true;
        }

        if ([
            TIPO_DIA_FOLGA,
            TIPO_FERIADO,
            TIPO_EM_OUTRA_LOJA,
        ].includes(state.selectedTipoFalta)) {
            return true;
        }

        if (jaJustificado.value) {
            return true;
        }

        return false;
    })

    let desabilitarBtnSalvar = computed(() => {
        if (state.selectedTipoFalta == null || state.selectedTipoFalta == undefined) {
            return true;
        }

        if (jaJustificado.value) {
            return true;
        }

        return false;
    })

    const jaJustificado = computed(() => {
        if (props.pontos.STATUS || props.pontos.JUSTIFICATIVA == "Ponto Incompleto") {
            return true;
        } else {
            return false;
        }
    });

    const desativarBtn = computed(() => {
        let chegada = props.horaChegada;
        let inicioAlmoco = props.horaAlmocoInicial;
        let fimAlmoco = props.horaAlmocoFinal;
        let saida = props.horaSaida;

        if (
            chegada != null &&
            inicioAlmoco != null &&
            fimAlmoco != null &&
            saida != null &&
            props.pontos.TIPO != TIPO_ATRASO_JUSTIFICADO &&
            props.dadosDocumento.length == 0
        ) {
            return true;
        }

        return false;

    });

    const desativarBtnVerDoc = computed(() => {
        if (
            props.dadosDocumento.length == 0 ||
            props.pontos.TIPO == TIPO_FERIADO ||
            props.pontos.TIPO == TIPO_DIA_FOLGA
        ) {
            return false;
        } else {
            return true;
        }
    });

    const showBtnDelete = computed(() => {
        if (
            props.dadosDocumento.length > 0 ||
            props.pontos.TIPO == TIPO_DIA_FOLGA ||
            props.pontos.TIPO == TIPO_EM_OUTRA_LOJA ||
            props.pontos.TIPO == TIPO_ATRASO_JUSTIFICADO
        ) {
            return true;
        } else {
            return false;
        }
    });

    const desativarBotoesSeNadaSelecionado = computed(() => {
        return state.selectedTipoFalta == null;
    });

    const dadosDocumentoAusencia = computed(() => {
        const justificativaValor = state.justificativa ? state.justificativa : "";
        if (justificativaValor == undefined) {
            return {};
        }

        let cpf = props.funcionario.cpf;
        let nomeFuncionario = props.funcionario.nome;
        let loginFuncionario = props.funcionario.loginFuncionario;
        let data = props.dadosAusencia;

        const dadosParaQrCode = {
            cod_funcionario: props.funcionario.cod_funcionario,
            cpf: cpf,
            nomeFuncionario: nomeFuncionario,
            loginFuncionario: loginFuncionario,
            data: data,
            falta: justificativaValor,
            tipoFalta: state.selectedTipoFalta,
            justificativaValor: justificativaValor,
            cid: state.selectedCID,
        };

        return dadosParaQrCode;
    });

    const actions = {
        imprimirJustificativa() {
            const conteudoElement = actions.criarHTMLParaPDF();

            printJS({
                documentTitle: "Justificativa de ausência",
                printable: conteudoElement,
                type: "html",
            });
        },

        criarHTMLParaPDF() {
            const justificativaValor = state.justificativa ? state.justificativa : "";

            const conteudoHTML = `<br><br><br>
              <div id="justificativaPDF">
                <p>JUSTIFICATIVA DE AUSÊNCIA</p>
                <p>Eu, ${props.funcionario.nome}, brasileiro (a), de CPF ${props.funcionario.cpf}, profissional lotado no cargo ${props.funcionario.cargo}, na empresa REAL ACESSÓRIOS venho justificar ao RH, minha ausência que foi devido a: <strong> ${justificativaValor}. </strong>  No dia ${props.dadosAusencia}, motivos pelos quais o ponto não foi registrado corretamente.</p>
                <p>Por ser expressão da verdade, firmo a presente.</p>
                <p>Brasília-DF, ___/___/_____.</p>
                <p>_____________________________________</p>
                <p>${props.funcionario.nome}</p>
              </div>
            `;

            const tempElement = document.createElement("div");
            tempElement.innerHTML = conteudoHTML;

            return tempElement;
        },

        modal() {
            state.modalQrCode = new xModal.create({
                width: 400,
                height: 550,
                el: "#modalQrCode",
                theme: "xModal-blue",
                onOpen: () => {
                    state.modalQrCodeOpened = true;
                },
                onClose: () => {
                    state.modalQrCodeOpened = false;
                },
            });
        },

        salvar() {
            const faltaSelecionada = state.selectedTipoFalta;

            if (
                faltaSelecionada == TIPO_FERIADO ||
                faltaSelecionada == TIPO_DIA_FOLGA ||
                faltaSelecionada == TIPO_EM_OUTRA_LOJA
            ) {
                actions.salvarFaltaFeriadoOuFolga();
            } else {
                state.modalQrCode.open();
            }
        },

        preencherJustificativa(TIPO: number) {
            state.showCIDAutocomplete = TIPO == 3 || TIPO == 12 ? true : false;

            const isFeriadoFolga = [TIPO_FERIADO, TIPO_DIA_FOLGA].includes(TIPO);
            state.hideButtons = isFeriadoFolga;

            const status = props.tiposDeFalta.find((item) => item.TIPO === TIPO);
            if (status) {
                state.justificativa = status.DESCRICAO;
            }
        },

        async salvarFaltaFeriadoOuFolga() {
            let dataFalta = props.dadosAusencia;
            dataFalta = actions.ajustarData(dataFalta);

            const param: iFaltaFeriadoFolga = {
                data: dataFalta,
                cod_funcionario: props.funcionario.cod_funcionario,
                tipo: state.selectedTipoFalta,
                falta: state.justificativa,
            };

            try {
                state.loading = true;
                state.inserirFalta = await gerenciarFolhaPontoDetalhesService.setFaltaFeriadoOuFolga(param);
                state.loading = false;
                Swal.fire({
                    icon: "success",
                    title: "Ausência salva com sucesso!",
                    showConfirmButton: false,
                    timer: 2500,
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Ocorreu um erro ao inserir a falta.",
                });
            }

            emit("atualizarDados");
            actions.limparInputs();
        },

        ajustarData(dataFalta) {
            const partesData = dataFalta.split("/");
            const dataObjeto = new Date(partesData[2], partesData[1] - 1, partesData[0]);
            const ano = dataObjeto.getFullYear();
            let mes = dataObjeto.getMonth() + 1;
            let dia = dataObjeto.getDate();
            const dataFormatada = `${ano}-${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia}`;

            return dataFormatada;
        },

        async deletarFalta() {
            let dataFalta = props.dadosAusencia;
            dataFalta = actions.ajustarData(dataFalta);

            const param: iDeletarFalta = {
                data: dataFalta,
                cod_funcionario: props.funcionario.cod_funcionario,
                cnpj: props.cnpj,
            };

            confirmaCodigo({
                msg: "Confirma exclusão deste registro?",
                call: async function () {
                    try {
                        state.loading = true;
                        await gerenciarFolhaPontoDetalhesService.deletarFalta(param);

                        if (props.dadosDocumento.length != 0) {
                            actions.deletarDocumento();
                        }

                        Swal.fire({
                            icon: "success",
                            title: "Ausência deletada com sucesso!",
                            showConfirmButton: false,
                            timer: 2500,
                        });

                        emit("fecharModal");
                        emit("atualizarDados");
                        state.loading = false;
                        actions.limparInputs();
                    } catch (error) {
                        Swal.fire({
                            icon: "error",
                            text: "Ocorreu um erro ao deletar a falta.",
                        });
                    }
                },
            });
        },

        async deletarDocumento() {
            let dataFalta = props.dadosAusencia;
            dataFalta = actions.ajustarData(dataFalta);
            let file_name = props.dadosDocumento[0].nome_arquivo;

            const param: iDeletarDocumento = {
                data: dataFalta,
                cod_funcionario: props.funcionario.cod_funcionario,
                file_name: file_name,
                cnpj: props.cnpj,
            };

            try {
                await gerenciarFolhaPontoDetalhesService.deletarDocumento(param);
                actions.deletarArquivo(file_name);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Ocorreu um erro ao deletar o documento.",
                });
            }
        },

        async deletarArquivo(file_name) {
            let cpf = props.funcionario.cpf.replaceAll(".", "").replaceAll("-", "");
            let usuario = stateLogin.state.login.LOGIN;
            let folderName = "ausencia";

            const param: iDeletarArquivo = {
                file_name: file_name,
                cpf: cpf,
                folderName: folderName,
                usuario: usuario,
            };

            try {
                await gerenciarFolhaPontoDetalhesService.deletarArquivo(param);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Ocorreu um erro ao deletar o arquivo.",
                });
            }
            state.loading = false;
            actions.limparInputs();
        },

        visualizarDocumento() {
            if (props.dadosDocumento.length === 0) {
                Swal.fire({
                    icon: "error",
                    text: "Não há documento a ser visualizado.",
                });
                return;
            }

            let cpf = props.funcionario.cpf.replace(/\D/g, "");
            let file_name = props.dadosDocumento[0].nome_arquivo;
            let urlPdf = `http://www.reallatas.com.br/doc_funcionario/documentos/${cpf}/ausencia/${file_name}`;

            if (file_name.toLowerCase().endsWith(".pdf")) {
                window.open(`${urlPdf}`, "_blank");
            } else if (file_name.toLowerCase().match(/\.(jpeg|jpg|pdf|png)$/) != null) {
                let img = new Image();
                img.src = urlPdf;
                let newTab = window.open("");
                newTab.document.write(img.outerHTML);
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Tipo de arquivo não suportado.",
                });
            }
        },

        limparInputs() {
            state.selectedCID = "";
            state.justificativa = "";
        },

        fecharModalQrCode() {
            state.modalQrCode.close();
        },

        fecharModalJustificarFalta() {
            state.modalQrCode.close();
            actions.limparInputs();
            emit("atualizarDados");
        },
    }

    return {
        state,
        actions,
        emit,
        desabilitarJustificativa,
        desabilitarBtnSalvar,
        jaJustificado,
        desativarBtn,
        desativarBtnVerDoc,
        showBtnDelete,
        desativarBotoesSeNadaSelecionado,
        dadosDocumentoAusencia,
    };
}