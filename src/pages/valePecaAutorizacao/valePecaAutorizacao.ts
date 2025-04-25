import { computed, reactive } from "vue";
import { iFuncionario, iValeFuncionario } from "./interfaces";
import Swal from "sweetalert2";
import valePecaAutorizacaoService from "./valePecaAutorizacao.service";

export const state = reactive({
    loading: false,
    modalSelecionarFuncionarioOpened: false,
    funcionario: <iFuncionario>null,
    listaFuncionarios: <iFuncionario[]>[],
    valesFuncionario: <iValeFuncionario[]>[]
})

export const actions = {
    async init() {
        await actions.getFuncionarios()
    },

    async selecionarFuncionario(codFuncionario: number) {
        state.funcionario = state.listaFuncionarios.find(funcionario => funcionario.COD_FUNCIONARIO == codFuncionario)
        await actions.getValesFuncionario()
        state.modalSelecionarFuncionarioOpened = false
    },

    async getFuncionarios() {
        try {
            state.loading = true
            const data = await valePecaAutorizacaoService.getFuncionarios()
            state.listaFuncionarios = data
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: 'Erro ao buscar os funcionários.'
            })
        } finally {
            state.loading = false
        }
    },

    async getValesFuncionario() {
        try {
            state.loading = true
            const data = await valePecaAutorizacaoService.getValesFuncionario(state.funcionario.COD_FUNCIONARIO)
            state.valesFuncionario = data
        } catch {
            state.loading = false
            Swal.fire(
                {
                    icon: 'error',
                    title: 'Erro ao buscar os vales do funcionario.'
                }
            )
        } finally {
            state.loading = false
        }
    }
}

export const computeds = {
    funcionarioNaoSelecionado: computed(() => {
        return !state.funcionario?.COD_FUNCIONARIO;
    })
}