import { computed, reactive } from "vue";
import { iFuncionario, iOrcamento, iValeFuncionario } from "./interfaces";
import Swal from "sweetalert2";
import valePecaAutorizacaoService from "./valePecaAutorizacao.service";
import { error } from "jquery";

export const state = reactive({
    loading: false,
    modalSelecionarFuncionarioOpened: false,
    funcionario: <iFuncionario>null,
    listaFuncionarios: <iFuncionario[]>[],
    valesFuncionario: <iValeFuncionario[]>[],
    orcamento: <iOrcamento>null,
})

export const actions = {
    async init() {
        await actions.getFuncionarios()
    },

    limparStates() {
        state.funcionario = null
        state.orcamento = null
    },

    async selecionarFuncionario(codFuncionario: number) {
        state.orcamento = null

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
            console.error(error)
            Swal.fire(
                {
                    icon: 'error',
                    title: 'Erro ao buscar os vales do funcionario.'
                }
            )
        } finally {
            state.loading = false
        }
    },

    async getOrcamento(orc: number) {
        try {
            state.loading = true
            const data = await valePecaAutorizacaoService.getOrcamento(orc)

            if (data.error) {
                Swal.fire({
                    icon: 'warning',
                    title: data.msg
                })

                return
            }

            state.orcamento = data
        } catch (error) {
            console.error(error)
            Swal.fire(
                {
                    icon: 'error',
                    title: 'Erro ao buscar o Orçamento.'
                }
            )
        } finally {
            state.loading = false
        }
    }
}