import { reactive } from "vue";
import axios from 'axios';
import Swal from "sweetalert2";
import { show } from "@/ts/utils";


export const state = reactive(({
    solicitante: (""),
    loja: (""),
    assunto: (""),
    descricao: (""),
    anexos: ([]),
}))

export const actions = {

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
            const response = await axios.post('siap/chamados', {
                call: 'insert',
                param
            });

            show('Chamado cadastrado com sucesso');
            actions.resetForm()
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }

    },

}

function validateForm() {
    if (!state.solicitante || !state.loja || !state.assunto || !state.descricao) {
        showValidationError('Verifique os campos obrigatórios');
        return false;
    }
    return true;
}

function showValidationError(message: string) {
    Swal.fire({
        icon: 'error',
        title: 'Preencha os campos obrigatórios',
        text: message,
    });
}

export default { state, actions }