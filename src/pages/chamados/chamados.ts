import { nextTick, reactive } from "vue";
import Swal from "sweetalert2";
import serviceChamados from './services/chamados.service';
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { iChamados, iVerDetalhesChamadoResponse, iParamGetChamados } from "./interfaces";
import { dataBrasil } from "@/ts/utils";

export const state = reactive(({
    solicitante: (""),
    loja: (""),
    assunto: (""),
    descricao: (""),
    anexos: ([]),
    chamados: <iChamados[]>[],
    loadingSalvar: false,
    loading: false,
    totalItems: 0,
    itemsPerPage: 5,
    search: (""),
    detalhes: <iVerDetalhesChamadoResponse>{},
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
            state.loadingSalvar = true;

            await serviceChamados.insertChamado(param)

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
            state.loadingSalvar = false;
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

    modal() {

        state.pnModalDetalhes = new xModal.create({
            height: 500,
            width: 600,
            el: '#pnModalDetalhes'
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
