import { nextTick, reactive } from "vue";
import axios from 'axios';
import Swal from "sweetalert2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { iChamados, iDetalhes } from "./interfaces";
import { dataBrasil, show } from "@/ts/utils";

export const state = reactive(({
    solicitante: (""),
    loja: (""),
    assunto: (""),
    descricao: (""),
    anexos: ([]),
    dsChamados: <iChamados[]>[],
    loadingSalvar: false,
    loadingBuscarDetalhes: false,
    loading: false,
    dbChamados: 0,
    totalItems: 0,
    itemsPerPage: 5,
    search: (""),
    detalhes: <iDetalhes>{},
    pnModalDetalhes: <iModalCreate>(<unknown>null),
}))


export const actions = {

    begin() {
        nextTick(() => {
            actions.modal();

        });
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

        const param = {
            solicitante: state.solicitante,
            loja: state.loja,
            assunto: state.assunto,
            descricao: state.descricao,
            anexos: state.anexos,
        };

        try {
            state.loadingSalvar = true;
            await axios.post('siap/chamados', {
                call: 'insert',
                param
            });
            Swal.fire({
                icon: 'success',
                text: 'Chamado cadastrado com sucesso'
            })

            actions.resetForm()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao enviar os dados'
            })
        } finally {
            state.loadingSalvar = false;
        }

    },

    async getChamados({ page, itemsPerPage, sortBy, search }: any) {
        try {
            const { data } = await axios.post('siap/chamados', {
                call: 'getChamados',
                page,
                itemsPerPage,
                sortBy,
                search,
            });
            state.dsChamados = data.chamados.map((chamado: iChamados) => ({
                ...chamado,
                dataFormatada: dataBrasil(chamado.DATA_CRIACAO),
            }));
            state.totalItems = data.total
        } catch (error) {
            console.error(error);
        }
    },

    async verDetalhesChamado(keyJira: string, descricao: string, solicitante: string, dataFormatada: string) {
        state.loadingBuscarDetalhes = true
        try {
            let { data } = await axios.post('siap/chamados', {
                call: 'verDetalhesChamado',
                param: {
                    keyJira,
                },
            });
            state.detalhes.responsavel = data.responsavel;
            state.detalhes.descricao = descricao;
            state.detalhes.solicitante = solicitante;
            state.detalhes.dataFormatada = dataFormatada;
            state.detalhes.prioridade = data.prioridade;
            state.detalhes.statusJira = data.statusJira;
            state.detalhes.comentarios = data.comentarios;

            state.pnModalDetalhes.open();
        } catch (error) {
            show("Não existem informações sobre esse chamado")
            console.error(error);
        } finally {
            state.loadingBuscarDetalhes = false
        }
    },

    modal() {

        state.pnModalDetalhes = new xModal.create({
            height: 500,
            width: 600,
            el: '#pnModalDetalhes',
            onOpen: () => {
            },
            onClose() {
            },
        })
    }


}

function showValidationError(message: string) {
    Swal.fire({
        icon: 'error',
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
