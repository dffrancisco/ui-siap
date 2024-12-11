import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceAbrirCaixa from "./services/abrirCaixa.service";
import { iCaixasAbertos, iFuncionarios, iMdc, iParamsAbrirCaixa } from "./interfaces";

export const state = reactive({
    loading: false,
    mdc: <iMdc | null>null,
    funcionarios: <iFuncionarios[]>[],
    caixasAbertos: <iCaixasAbertos[]>[],
    modalAbrirCaixaOpened: false,
});

export const actions = {
    async init() {
        actions.getDadosAbrirCaixa()
    },

    async getDadosAbrirCaixa() {
        try {
            state.loading = true;
            const data = await serviceAbrirCaixa.getDadosAbrirCaixa()
            state.mdc = data.mdc;
            state.funcionarios = data.funcionarios;
            state.caixasAbertos = data.caixasAbertos;

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados iniciais!"
            });
        } finally {
            state.loading = false;
        }

    },

    async abrirMDC() {
        try {
            state.loading = true;
            let mdcAberto = await serviceAbrirCaixa.abrirMDC()
            state.mdc = mdcAberto.mdc;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao abrir o MDC"
            });
        } finally {
            state.loading = false;
        }
    },

    async abrirCaixa(codFuncionario: number, valorTroco: string) {
        try {
            state.loading = true;

            let param: iParamsAbrirCaixa = {
                COD_FUNCIONARIO: codFuncionario,
                VALOR_TROCO: parseFloat(valorTroco),
                LOGIN: state.funcionarios.find(f => f.COD_FUNCIONARIO === codFuncionario)?.LOGIN || ""
            }

            let caixaAberto = await serviceAbrirCaixa.abrirCaixa(param)
            state.caixasAbertos = caixaAberto;

            Swal.fire({
                icon: "success",
                title: "Caixa aberto com sucesso.",
                showConfirmButton: false,
                timer: 1000,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao abrir o caixa"
            });
        } finally {
            state.loading = false;
        }
    }

}