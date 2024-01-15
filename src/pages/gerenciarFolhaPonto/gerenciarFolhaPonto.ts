import { reactive, computed } from 'vue';
import { iFuncionario, iGetMesEAno } from './interface';
import gerenciarFolhaPontoService from './services/gerenciarFolhaPonto.service';
import Swal from 'sweetalert2';

export const state = reactive(({
    funcionarios: {},
    loading: false,
}))

export const funcionariosOrdenados = computed(() => {
    let funcionariosArray = <iFuncionario[]>[]

    for (let indexFuncionario in state.funcionarios) {
        funcionariosArray.push(state.funcionarios[indexFuncionario])
    }

    funcionariosArray.sort((funcionario1, funcionario2) => {
        return funcionario1.NOME_COMP > funcionario2.NOME_COMP
    })

    return funcionariosArray
})

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