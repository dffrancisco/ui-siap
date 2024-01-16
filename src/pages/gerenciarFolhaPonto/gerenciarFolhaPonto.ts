import { reactive, computed } from 'vue';
import { iFuncionario, iGetMesEAno, iTotalizador } from './interface';
import gerenciarFolhaPontoService from './services/gerenciarFolhaPonto.service';
import Swal from 'sweetalert2';

export const state = reactive(({
    funcionarios: {},
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    selectedFuncionario: <string | null>(null),
    loading: false,
}))

export const meses = computed(() => [
    { text: "Janeiro", value: 1 },
    { text: "Fevereiro", value: 2 },
    { text: "Março", value: 3 },
    { text: "Abril", value: 4 },
    { text: "Maio", value: 5 },
    { text: "Junho", value: 6 },
    { text: "Julho", value: 7 },
    { text: "Agosto", value: 8 },
    { text: "Setembro", value: 9 },
    { text: "Outubro", value: 10 },
    { text: "Novembro", value: 11 },
    { text: "Dezembro", value: 12 },
]);

export const anos = computed(() => {
    const anosArray: number[] = [];
    const anoAtual = new Date().getFullYear();

    for (let i = 0; i < 20; i++) {
        const ano = anoAtual - 10 + i;
        anosArray.push(ano);
    }

    return anosArray;
});

export const funcionariosOrdenados = computed(() => {
    let funcionariosArray = <iFuncionario[]>[]

    for (let indexFuncionario in state.funcionarios) {
        funcionariosArray.push(state.funcionarios[indexFuncionario])
    }

    funcionariosArray.sort((funcionario1, funcionario2) => {
        return funcionario1.NOME_COMP > funcionario2.NOME_COMP ? 1 : -1
    })

    console.log(state.funcionarios);

    return funcionariosArray
})


export const totalizador = computed(() => {
    let totalizadorArray;
})

export const actions = {

    async getFuncionarios(mes: number, ano: number) {

        const param: iGetMesEAno = {
            mes: mes,
            ano: ano
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


    async init(mes: number, ano: number) {
        state.loading = true;

        await actions.getFuncionarios(mes, ano);

        setTimeout(() => {
            state.loading = false;
        }, 100);

    }
}

export default { state, actions, meses, anos }