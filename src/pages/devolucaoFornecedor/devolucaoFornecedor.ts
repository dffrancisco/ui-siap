import { reactive } from 'vue'
import xModal, { iModalCreate } from '@/plugins/xModal/xModal'

import { iDevolucao, iFornecedor } from './interfaces'
import serviceDevolucaoFornecedor from "./services/devolucaoFornecedor.service";
import Swal from 'sweetalert2';


export const state = reactive({
    modalLocalizarDevolucoes: <iModalCreate>{},
    modalSelecionarFornecedor: <iModalCreate>{},

    modalOpened: false,

    dbDevolucao: <iDevolucao>{},
    dbFornecedor: <iFornecedor>{},

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
            height: 466,
            width: 704,
            theme: "xModal-blue",
            onOpen: () => { state.modalOpened = true },
            onClose: () => { state.modalOpened = false }
        })

        state.modalSelecionarFornecedor = new xModal.create({
            el: '#modalSelecionarFornecedor',
            height: 466,
            width: 704,
            theme: "xModal-blue",
            onOpen: () => { state.modalOpened = true },
            onClose: () => { state.modalOpened = false },
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

    habilitarBtns() {
        state.disabledBtnFinalizar = false
        state.disabledBtnDelete = false
        state.disabledBtnPrint = false
        state.disabledBtnAdicionarTransportadora = false
        state.disabledBtnAdicionarItens = false
    },

    init() {
        actions.criarModais();
    },

    async selecionarDevolucao(devolucao: iDevolucao) {
        try {
            state.loading = true

            let id_devolucao = devolucao.ID_DEVOLUCAO_FORNECEDOR

            let data = await serviceDevolucaoFornecedor.devolucaoSelecionado({ id_devolucao })

            state.dbFornecedor = {
                ID_FORNECEDOR: null,
                CGC_FORNECEDOR: data.CGC_FORNECEDOR,
                RAZAO_SOCIAL: data.RAZAO_SOCIAL,
            }

            state.dbDevolucao = {
                ...data
            }

            actions.habilitarBtns()
            if (state.dbDevolucao.STATUS == 1) {
                state.disabledBtnFinalizar = true
            }

            state.modalLocalizarDevolucoes.close()

            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao selecionar devolução!",
            });
        }
    },

    async fornecedorSelecionado(fornecedor: iFornecedor) {
        try {
            state.loading = true

            let id_fornecedor = fornecedor.ID_FORNECEDOR

            let data = await serviceDevolucaoFornecedor.fornecedorSelecionado({ id_fornecedor })

            state.dbDevolucao = {} as iDevolucao

            state.dbFornecedor = {
                ...data
            }

            actions.habilitarBtns()
            state.modalSelecionarFornecedor.close()

            state.loading = false
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao selecionar fornecedor!",
            });
        }
    }
}

export default { state, actions }