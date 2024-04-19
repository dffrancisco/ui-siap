import { reactive, computed } from 'vue'
import xModal, { iModalCreate } from '@/plugins/xModal/xModal'
import {
    iDevolucao,
    iItem,
    iItensDevolucao,
    iParamEmitirNotaDevolucaoFornecedorPrevia,
    objNotasAgrupadas
} from './interfaces'
import serviceDevolucaoFornecedor from "./services/devolucaoFornecedor.service";
import Swal from 'sweetalert2';
import { msgConfirm } from '@/ts/message';
import printJS from 'print-js';
import config from '@/ts/config';
import moment from 'moment';

export const notasAgrupadas = computed((): iItensDevolucao[] => {
    let notasUnicas: objNotasAgrupadas = {}

    state.dbItensDevolucao.forEach(nota => {
        if (!notasUnicas[nota.NUM_NOTA]) {
            notasUnicas[nota.NUM_NOTA] = nota;
        }
    })

    return Object.values(notasUnicas).sort((a, b) => b.NUM_NOTA - a.NUM_NOTA);
})

export const somaTotalItens = computed((): number => {
    let total = 0;

    state.dbItensDevolucao.forEach(item => {
        total += item.VALOR_TOTAL;
    });

    state.dbDevolucao.VALOR = total + state.dbDevolucao.VALOR_FRETE

    return state.dbDevolucao.VALOR;
});

const NOME_MESES = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"]

export const state = reactive({
    modalLocalizarDevolucoes: <iModalCreate>{},
    modalSelecionarFornecedor: <iModalCreate>{},
    modalTransportadora: <iModalCreate>{},
    modalEscolherItem: <iModalCreate>{},
    modalInformarQtdItem: <iModalCreate>{},

    modalOpened: false,
    modalLocalizarDevolucoesOpened: false,
    modalSelecionarFornecedorOpened: false,
    modalTransportadoraOpened: false,
    modalEscolherItemOpened: false,
    modalInformaQtdItemOpened: false,

    dbDevolucao: <iDevolucao>{},
    dbItensDevolucao: <iItensDevolucao[]>[],
    dbItem: <iItem>{},

    disabledBtnFinalizar: true,
    disabledBtnDelete: true,
    disabledBtnPrint: true,
    disabledBtnAdicionarTransportadora: true,
    disabledBtnAdicionarItens: true,

    loading: false
})

export const actions = {
    criarModais() {
        state.modalLocalizarDevolucoes = new xModal.create({
            el: '#modalLocalizarDevolucoes',
            height: 458,
            width: 704,
            theme: "xModal-blue",
            onOpen: () => { state.modalOpened = true; state.modalLocalizarDevolucoesOpened = true },
            onClose: () => { state.modalOpened = false; state.modalLocalizarDevolucoesOpened = false }
        })

        state.modalSelecionarFornecedor = new xModal.create({
            el: '#modalSelecionarFornecedor',
            height: 458,
            width: 704,
            theme: "xModal-blue",
            onOpen: () => { state.modalOpened = true; state.modalSelecionarFornecedorOpened = true },
            onClose: () => { state.modalOpened = false; state.modalSelecionarFornecedorOpened = false },
        })

        state.modalTransportadora = new xModal.create({
            el: '#modalTransportadora',
            height: 372,
            width: 784,
            theme: "xModal-blue",
            onOpen: () => { state.modalOpened = true; state.modalTransportadoraOpened = true; },
            onClose: () => { state.modalOpened = false; state.modalTransportadoraOpened = false; },
        })

        state.modalEscolherItem = new xModal.create({
            el: '#modalEscolherItem',
            height: 528,
            width: 704,
            theme: "xModal-blue",
            onOpen: () => { state.modalOpened = true; state.modalEscolherItemOpened = true },
            onClose: () => { state.modalOpened = false; state.modalEscolherItemOpened = false },
        })

        state.modalInformarQtdItem = new xModal.create({
            el: "#modalInformarQtdItem",
            height: 488,
            width: 715,
            theme: "xModal-blue",
            onOpen: () => {
                state.modalInformaQtdItemOpened = true;
            },
            onClose: () => {
                state.modalInformaQtdItemOpened = false;
            },
        });
    },

    openModalLocalizarDevolucoes() {
        state.modalLocalizarDevolucoes.open();
    },

    closeModalLocalizarDevolucoes() {
        state.modalLocalizarDevolucoes.close();
    },

    openModalSelecionarFornecedor() {
        state.modalSelecionarFornecedor.open();
    },

    closeModalSelecionarFornecedor() {
        state.modalSelecionarFornecedor.close();
    },

    openModalTransportadora() {
        state.modalTransportadora.open();
    },

    closeModalTransportadora() {
        state.modalTransportadora.close();
    },

    openModalEscolherItem() {
        state.modalEscolherItem.open();
    },

    closeModalEscolherItem() {
        state.modalEscolherItem.close();
    },

    openModalInformarQtdItem(item: iItensDevolucao) {
        state.dbItem = item;

        if (item.ID_DEVOLUCAO_FORNECEDOR_ITEM) {
            state.dbItem = {
                ID_DEVOLUCAO_FORNECEDOR_ITEM: item.ID_DEVOLUCAO_FORNECEDOR_ITEM,
                ID_ENTRADA: item.ID_NF_ENTRADA_MANIFESTO,
                ID_ITEM: item.ID_NF_ENTRADA_ITEM,
                DESCRICAO: item.DESCRICAO,
                NUM_NOTA: item.NUM_NOTA,
                QUANTIDADE: item.QUANTIDADE,
                COD_FABRICANTE: item.COD_FABRICANTE,
                CUSTO: item.VALOR_UNITARIO,
                COD_PRODUTO: item.COD_PRODUTO,
                VALOR_ICMS_ST: item.VALOR_ICMS_ST,
                CST: item.CST,
                BASE_ICMS_ST: item.BASE_ICMS_ST,
                PERCENTUAL_ICMS: item.PERCENTUAL_ICMS,
                PERCENTUAL_IPI: item.PERCENTUAL_IPI,
                UF: state.dbDevolucao.UF,
                CHAVE: item.CHAVE,
                DATA_EMISSAO: item.DATA_EMISSAO,
                QTD: item.QTD,
                CST_PIS: item.CST_PIS,
                CST_COFINS: item.CST_COFINS,
                PERCENTUAL_PIS: item.PERCENTUAL_PIS,
                PERCENTUAL_COFINS: item.PERCENTUAL_COFINS,
                CST_IPI: item.CST_IPI
            }
        }

        state.modalInformarQtdItem.open();
    },

    closeModalInformarQtdItem() {
        state.modalInformarQtdItem.close();
    },

    fretePorConta(tipoDeFrete: number) {
        if (tipoDeFrete == 0) {
            return "Por conta do emitente"
        }

        if (tipoDeFrete == 1) {
            return "Por conta do destinatário/remetente"
        }

        if (tipoDeFrete == 2) {
            return "Por conta de terceiros"
        }

        if (tipoDeFrete == 3) {
            return "Transporte próprio por conta do remetente"
        }

        if (tipoDeFrete == 4) {
            return "Transporte próprio por conta do destinatário"
        }

        if (tipoDeFrete == 9) {
            return "Sem transporte"
        }
    },


    habilitarBtns() {
        state.disabledBtnFinalizar = false
        state.disabledBtnDelete = false
        state.disabledBtnPrint = false
        state.disabledBtnAdicionarTransportadora = false
        state.disabledBtnAdicionarItens = false
    },

    desabilitarBtns() {
        state.disabledBtnFinalizar = true
        state.disabledBtnDelete = true
        state.disabledBtnPrint = true
        state.disabledBtnAdicionarTransportadora = true
        state.disabledBtnAdicionarItens = true
    },

    init() {
        actions.criarModais();
    },

    async getDevolucao(devolucao: iDevolucao) {
        try {
            state.loading = true

            let id_devolucao = devolucao.ID_DEVOLUCAO_FORNECEDOR

            let data = await serviceDevolucaoFornecedor.getDevolucao(id_devolucao)

            state.dbDevolucao = data.DEVOLUCAO
            state.dbItensDevolucao = data.ITENS_DEVOLUCAO

            actions.habilitarBtns()

            if (state.dbDevolucao.STATUS == 1) {
                state.disabledBtnFinalizar = true
            }

            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao selecionar devolução!",
            });
        }
    },

    async deleteItemDevolucao(id_devolucaoFornecedorItem: number) {
        try {

            if (await msgConfirm("Confirmação", "Confirma exclusão deste item?")) {
                state.loading = true

                await serviceDevolucaoFornecedor.deleteItemDevolucao(id_devolucaoFornecedorItem)

                await actions.getDevolucao(state.dbDevolucao)

                state.loading = false;
            }

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir item de devolução!",
            });
        }
    },

    async finalizarDevolucao() {
        try {
            if (!state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR_TRANSP) {
                Swal.fire({
                    icon: "error",
                    text: "É necessário adicionar transportadora para finalizar a devolução!",
                });
                return false
            }

            if (state.dbItensDevolucao.length == 0) {
                Swal.fire({
                    icon: "error",
                    text: "É necessário adicionar itens para finalizar a devolução!",
                })
                return false
            }

            let param = {
                ID_DEVOLUCAO_FORNECEDOR: state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR,
                CHAVE_DEVOLUCAO: state.dbDevolucao.CHAVE_DEVOLUCAO,
                VALOR: state.dbDevolucao.VALOR,
                NUM_NOTA_DEVOLUCAO: state.dbDevolucao.NUM_NOTA_DEVOLUCAO,
            }


            if (await msgConfirm("Confirmação", "Tem certeza de que deseja finalizar? Essa ação não poderá ser desfeita!")) {
                state.loading = true;

                await serviceDevolucaoFornecedor.finalizarDevolucao({ param })
                await actions.getDevolucao(state.dbDevolucao)

                await actions.imprimirNotaDevolucaoFornecedorPDF()

                Swal.fire({
                    icon: "success",
                    text: "Nota de devolução finalizada!",
                });

                state.loading = false;
            }
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.msg || "Erro ao finalizar devolução!",
            });
        }
    },

    async deleteDevolucao() {
        try {

            if (await msgConfirm("Confirmação", "Confirma exclusão desta devolução?")) {
                state.loading = true

                await serviceDevolucaoFornecedor.deleteDevolucao(state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR)

                state.dbDevolucao = {} as iDevolucao
                state.dbItensDevolucao = [] as iItensDevolucao[]

                actions.desabilitarBtns()

                Swal.fire({
                    icon: "success",
                    text: "Nota de devolução deletada!",
                });

                state.loading = false;
            }

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir devolução!",
            });
        }
    },

    async emitirNotaDevolucaoFornecedorPrevia() {
        try {
            if (!state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR_TRANSP) {
                Swal.fire({
                    icon: "error",
                    text: "É necessário adicionar transportadora!",
                });
                return false
            }

            if (state.dbItensDevolucao.length == 0) {
                Swal.fire({
                    icon: "error",
                    text: "É necessário adicionar itens!",
                })
                return false
            }

            state.loading = true

            let param = {
                ID_DEVOLUCAO_FORNECEDOR: state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR,
                PREVIA: true
            }

            let data = await serviceDevolucaoFornecedor.emitirNotaDevolucaoFornecedorPrevia(param)

            printJS({
                printable: data.pdf,
                type: 'pdf',
                base64: true,
            })

            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.msg || "Erro ao emitir nota de devolução!",
            });
        }
    },

    async imprimirNotaDevolucaoFornecedorPDF() {
        try {
            state.loading = true;

            let chave = state.dbDevolucao.CHAVE_DEVOLUCAO
            let ano = moment(state.dbDevolucao.DATA).year();
            let mes = NOME_MESES[moment(state.dbDevolucao.DATA).month()]
            let url = `${config.SERVER}:${config.PORT}/NFe/${ano}-${mes}/DevolucaoFornecedor/${chave}-nfe.pdf`;

            printJS({
                printable: url,
                type: "pdf",
            });

            state.loading = false;

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir nota de devolução pdf!",
            });
        }
    },

    async downloadXmlNfDevolucaoFornecedor() {
        try {
            state.loading = true;

            let chave = state.dbDevolucao.CHAVE_DEVOLUCAO
            let ano = moment(state.dbDevolucao.DATA).year();
            let mes = NOME_MESES[moment(state.dbDevolucao.DATA).month()]
            let url = `${config.SERVER}:${config.PORT}/NFe/${ano}-${mes}/DevolucaoFornecedor/${chave}-nfe.xml`;

            let response = await fetch(url);
            let xmlContent = await response.text();

            let blob = new Blob([xmlContent], { type: 'text/xml' });

            let link = document.createElement('a');
            link.download = `${chave}-nfe.xml`;
            link.href = window.URL.createObjectURL(blob);

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            state.loading = false;

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao baixa a nota de devolução xml!",
            });
        }
    },

    async downloadXmlPrevia() {
        try {

            if (!state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR_TRANSP) {
                Swal.fire({
                    icon: "error",
                    text: "É necessário adicionar transportadora!",
                });
                return false
            }

            if (state.dbItensDevolucao.length == 0) {
                Swal.fire({
                    icon: "error",
                    text: "É necessário adicionar itens!",
                })
                return false
            }

            state.loading = true;

            let param: iParamEmitirNotaDevolucaoFornecedorPrevia = {
                ID_DEVOLUCAO_FORNECEDOR: state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR,
                PREVIA: true
            }

            let data = await serviceDevolucaoFornecedor.emitirNotaDevolucaoFornecedorPrevia(param)

            let blob = new Blob([data.xml], { type: 'text/xml' });

            let link = document.createElement('a');
            link.download = `${state.dbDevolucao.RAZAO_SOCIAL}-previa.xml`;
            link.href = window.URL.createObjectURL(blob);

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao baixar xml prévia!",
            });
        }
    }

}

export default { state, actions, notasAgrupadas, somaTotalItens }