import { reactive, computed } from 'vue';
import { iFuncionario, iGetMesEAno, iTotalizador } from './interface';
import gerenciarFolhaPontoService from './services/gerenciarFolhaPonto.service';
import Swal from 'sweetalert2';

export const state = reactive(({
    funcionarios: {},
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    selectedFuncionario: <number | null>(null),
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

    return funcionariosArray
})


export const totalizador = computed(() => {
    const total: iTotalizador = {
        QTD_A_JUSTIFICAR: 0,
        QTD_FALTAS_JUSTIFICADAS: 0,
        QTD_PONTOS_INCOMPLETOS: 0,
        QTD_PONTOS_NAO_BATIDOS: 0,
    };

    for (const func of Object.values(state.funcionarios) as iFuncionario[]) {
        if (func.QTD_A_JUSTIFICAR) total.QTD_A_JUSTIFICAR += func.QTD_A_JUSTIFICAR;
        if (func.QTD_FALTAS_JUSTIFICADAS) total.QTD_FALTAS_JUSTIFICADAS += func.QTD_FALTAS_JUSTIFICADAS;
        if (func.QTD_PONTOS_INCOMPLETOS) total.QTD_PONTOS_INCOMPLETOS += func.QTD_PONTOS_INCOMPLETOS;
        if (func.QTD_PONTOS_NAO_BATIDOS) total.QTD_PONTOS_NAO_BATIDOS += func.QTD_PONTOS_NAO_BATIDOS;
    }

    return total;
})

export const actions = {

    handleFuncionarioChange() {
        actions.getFuncionarios(state.selectedFuncionario, state.mes, state.ano);
    },

    async getFuncionarios(cod_funcionario: number, mes: number, ano: number) {

        const param: iGetMesEAno = {
            cod_funcionario: cod_funcionario,
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


    async init(cod_funcionario: number, mes: number, ano: number) {
        state.loading = true;

        await actions.getFuncionarios(cod_funcionario, mes, ano);

        setTimeout(() => {
            state.loading = false;
        }, 100);

    }
}

export default { state, actions, meses, anos, totalizador }