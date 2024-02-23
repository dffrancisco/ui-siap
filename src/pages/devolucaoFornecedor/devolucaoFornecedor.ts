import { reactive } from 'vue'
import xModal, { iModalCreate } from '@/plugins/xModal/xModal'

import { iDevolucao } from './interfaces'

export const state = reactive({
    modalLocalizarDevolucoes: <iModalCreate>{},
    modalLocalizarDevolucoesOpened: false,

    dbDevolucaoSelecionado: <iDevolucao>{},
})

export const actions = {
    criarModais() {
        state.modalLocalizarDevolucoes = new xModal.create({
            el: '#modalLocalizarDevolucoes',
            height: 466,
            width: 704,
            theme: "xModal-blue",
            onOpen: () => { state.modalLocalizarDevolucoesOpened = true },
            onClose: () => { state.modalLocalizarDevolucoesOpened = false }
        })
    },

    openModalLocalizarDevolucoes() {
        state.modalLocalizarDevolucoes.open();
    },

    closeModalLocalizarDevolucoes() {
        state.modalLocalizarDevolucoes.close();
    },

    selecionarDevolucao(devolucao: iDevolucao) {
        state.dbDevolucaoSelecionado = { ...devolucao }

        state.modalLocalizarDevolucoes.close()
    },

    init() {
        actions.criarModais();
    }
}

export default { state, actions }