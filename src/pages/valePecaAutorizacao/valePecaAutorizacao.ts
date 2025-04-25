import moment from "moment";
import { reactive } from "vue";

export const state = reactive({
    loading: false,
    modalSelecionarFuncionarioOpened: false,
    teste: {
        nomeFuncionario: 'Vinicius Medeiros Alves',
        cargo: "Programador",
        dataAdmissao: moment().format('DD/MM/YYYY'),
        cpf: '090.479.381-86'
    }
})

export const actions = {

}