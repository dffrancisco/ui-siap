import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceAbrirCaixa from "./services/abrirCaixa.service";
import { iCaixasAbertos, iFuncionarios, iMdc } from "./interfaces";

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
    }

}