import { reactive } from 'vue';
import { iFuncionario, iGetMesEAno } from './interface';
import gerenciarFolhaPontoService from './services/gerenciarFolhaPonto.service';
import Swal from 'sweetalert2';

export const state = reactive(({
    funcionarios: <iFuncionario[]>[],
    loading: false,
}))

export const actions = {

    async getFuncionarios(mesSelect: number, anoSelect: number) {

        const param: iGetMesEAno = {
            mesSelect: mesSelect,
            anoSelect: anoSelect
        }

        try {
            state.funcionarios = await gerenciarFolhaPontoService.getFuncionarios(param)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Ocorreu um erro ao buscar os funcionários'
            })
        }
    },

    getFotoFuncionarioURL(cpf: string) {
        if (!cpf) {
            return "";
        }

        const cpfSanitizado = cpf.replaceAll('.', '').replaceAll('-', '');
        return `http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`

    },


    // async init() {
    //     state.loading = true;
    //     await actions.getFuncionarios();
    //     // await actions.getPontosNaoBatidos()

    //     state.loading = false;
    // }
}

export default { state, actions }