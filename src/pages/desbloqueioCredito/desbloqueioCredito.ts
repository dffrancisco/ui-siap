import utils from '@/ts/utils';
import Swal from "sweetalert2";
import { computed, reactive } from "vue";

import {

} from './interfaces'
import desbloqueioCreditoService from './services/desbloqueioCredito.service';



export const state = reactive({
    listaDadosCredito: [],
    pesquisaCredito: "",
    abrirModalConfirmar: false,
});

export const actions = {
    async init() {

    },

    async getCredito(param: String) {
        if (!state.pesquisaCredito || state.pesquisaCredito.length !== 10 ) {
            Swal.fire({
                icon: 'warning',
                title: 'Chave inválida',
                text: 'certifique-se de que o campo não está em branco e se possuem 10 caracteres.',
            });
            return;
        }

        try {
            state.listaDadosCredito = await desbloqueioCreditoService.getCredito(param);

        } catch (err) {
            let mensagem = 'Erro inesperado';

            if (err.response?.data?.message) {
                mensagem = err.response.data.message;
            } else if (err.message) {
                mensagem = err.message;
            }

            Swal.fire({
                icon: 'info',
                title: 'Esse crédito não está bloqueado',
            });
        }
    },

    AbreModalConfirmar(){
         state.abrirModalConfirmar = !state.abrirModalConfirmar;
    }
};


