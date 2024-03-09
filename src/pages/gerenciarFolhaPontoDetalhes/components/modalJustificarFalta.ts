import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import printJS from "print-js";
import { computed, reactive, watch } from "vue";
import stateLogin from "../../login/login";
import globalState from "@/store/globalState";
import {
    iDeletarArquivo,
    iDeletarDocumento,
    iDeletarFalta,
    iFaltaFeriadoFolga,
} from "../interface";
import gerenciarFolhaPontoDetalhesService from "./../services/gerenciarFolhaPontoDetalhes.service";
import Swal from "sweetalert2";
import { confirmaCodigo } from "@/ts/utils";

export const setup = (emit: any, props: any) => {

    watch(
        () => props.opened,
        () => {
            if (props.opened) {
                state.loading = true;
                state.selectedFalta = props.pontos.TIPO;
                state.justificativa = props.pontos.STATUS;
                state.showCIDAutocomplete = false;
                state.loading = false;
            }
        }
    );

    const showSalvarFeriadoFolga = computed(() => {
        if (state.justificativa) {
            const selectedFalta = props.tiposDeFalta.find((item) => item.DESCRICAO === state.justificativa);
            return selectedFalta && (selectedFalta.DESCRICAO === "Dia de Folga" || selectedFalta.DESCRICAO === "Feriado");
        } else {
            return false;
        }
    });

    const preencherJustificativa = (TIPO: number) => {
        state.showCIDAutocomplete = TIPO == 3;

        const isFeriadoFolga = TIPO == 5 || TIPO == 7;
        state.hideButtons = isFeriadoFolga;

        const selectedFalta = props.tiposDeFalta.find((item) => item.TIPO === TIPO);
        if (selectedFalta) {
            state.justificativa = selectedFalta.DESCRICAO;
        }
    };

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
            props.dadosDocumento.length == 0
        ) {
            return true;
        } else {
            return false;
        }
    });

    const desativarBtnVerDoc = computed(() => {
        if (
            props.dadosDocumento.length == 0 ||
            props.pontos.STATUS == "Feriado" ||
            props.pontos.STATUS == "Dia de Folga"
        ) {
            return false;
        } else {
            return true;
        }
    });

    const desativarBtnDelete = computed(() => {
        if (
            props.dadosDocumento.length > 0 ||
            props.pontos.STATUS == "Feriado" ||
            props.pontos.STATUS == "Dia de Folga"
        ) {
            return true;
        } else {
            return false;
        }
    });

    const desativarBotoesSeNadaSelecionado = computed(() => {
        return state.selectedFalta == null;
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
            falta: state.selectedFalta,
            tipoFalta: state.selectedFaltaTipo,
            justificativaValor: justificativaValor,
            cid: state.selectedCID,
        };

        return dadosParaQrCode;
    });


    const state = reactive({
        loading: false,
        justificativa: null,
        selectedCID: null,
        showCIDAutocomplete: false,
        hideButtons: false,
        selectedFalta: null,
        selectedFaltaTipo: null,
        modalQrCode: <iModalCreate>(<unknown>null),
        modalQrCodeOpened: false,
        inserirFalta: <unknown>null,
        dadosDocumento: props.dadosDocumento,
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
                <p>Eu, ${props.funcionario.nome}, brasileiro (a), de CPF ${props.funcionario.cpf}, profissional lotado no cargo ${props.funcionario.cargo}, na empresa REAL ACESSÓRIOS venho justificar ao RH, minha ausência que foi devido a: ${justificativaValor}. No dia ${props.dadosAusencia}, motivos pelos quais impossibilitaram minha presença na empresa, bem como o desempenho das respectivas funções. Solicito, portanto, o abono da falta, visto que a mesma ocorreu por motivo de força maior e foi devidamente justificada.</p>
                <p>Por ser expressão da verdade, firmo a presente.</p>
                <p>Brasília-DF, ___/___/_____.</p>
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
            const faltaSelecionada = state.selectedFalta;

            if (faltaSelecionada === "Feriado" || faltaSelecionada === "Dia de Folga") {
                actions.salvarFaltaFeriadoOuFolga();
            } else {
                state.modalQrCode.open();
            }
        },

        async salvarFaltaFeriadoOuFolga() {
            let dataFalta = props.dadosAusencia;
            dataFalta = actions.ajustarData(dataFalta);

            const param: iFaltaFeriadoFolga = {
                falta: state.selectedFalta,
                data: dataFalta,
                cod_funcionario: props.funcionario.cod_funcionario,
                tipo: state.selectedFaltaTipo,
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
                cnpj: globalState.empresa.CGC_EMPRESA,
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
                cnpj: globalState.empresa.CGC_EMPRESA,
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
            state.selectedFalta = "";
            state.selectedCID = "";
            state.justificativa = "";
        },

        fecharModalQrCode() {
            state.modalQrCode.close();
            emit("atualizarDados");
            actions.limparInputs();
        },
    }



    return {
        state,
        actions,
        emit,
        showSalvarFeriadoFolga,
        preencherJustificativa,
        jaJustificado,
        desativarBtn,
        desativarBtnVerDoc,
        desativarBtnDelete,
        desativarBotoesSeNadaSelecionado,
        dadosDocumentoAusencia,
    };
}