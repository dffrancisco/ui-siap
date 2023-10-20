import { reactive } from "vue";
import axios from 'axios';
import Swal from "sweetalert2";

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
        }

    },

}

function showValidationError(message: string) {
    Swal.fire({
        icon: 'error',
        title: 'Preencha os campos obrigatórios',
        text: message,
    });
}

function validateForm() {
    if (!state.solicitante || !state.loja || !state.assunto || !state.descricao) {
        showValidationError('Verifique os campos obrigatórios');
        return false;
    }
    return true;
}


export default { state, actions }