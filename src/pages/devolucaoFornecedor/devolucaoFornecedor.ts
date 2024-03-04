import { reactive, computed } from 'vue'
import xModal, { iModalCreate } from '@/plugins/xModal/xModal'

import { iDevolucao, iItensDevolucao, objNotasAgrupadas } from './interfaces'
import serviceDevolucaoFornecedor from "./services/devolucaoFornecedor.service";
import Swal from 'sweetalert2';
import { msgConfirm } from '@/ts/message';

export const numNotas = computed((): iItensDevolucao[] => {
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

    return total;
});

export const state = reactive({
    modalLocalizarDevolucoes: <iModalCreate>{},
    modalSelecionarFornecedor: <iModalCreate>{},
    modalTransportadora: <iModalCreate>{},
    modalEscolherItem: <iModalCreate>{},

    modalOpened: false,
    modalLocalizarDevolucoesOpened: false,
    modalSelecionarFornecedorOpened: false,
    modalTransportadoraOpened: false,
    modalEscolherItemOpened: false,

    dbDevolucao: <iDevolucao>{},
    dbItensDevolucao: <iItensDevolucao[]>[],

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
            height: 288,
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

            state.dbDevolucao = {
                ...data.DEVOLUCAO
            }

            state.dbItensDevolucao = [
                ...data.ITENS_DEVOLUCAO
            ]

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

    async deleteDevolucao() {
        try {

            if (await msgConfirm("Confirmação", "Confirma exclusão desta devolução?")) {
                state.loading = true

                await serviceDevolucaoFornecedor.deleteDevolucao(state.dbDevolucao.ID_DEVOLUCAO_FORNECEDOR)

                state.dbDevolucao = {} as iDevolucao
                state.dbItensDevolucao = [] as iItensDevolucao[]

                actions.desabilitarBtns()

                state.loading = false;
            }

        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir devolução!",
            });
        }
    }

}

export default { state, actions, numNotas, somaTotalItens }