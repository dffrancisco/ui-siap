import utils from '@/ts/utils';
import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import serviceAbrirCaixa from "./services/abrirCaixa.service";
import { iCaixasAbertos, iFuncionarios, iMdc, iParamsAbrirCaixa } from "./interfaces";

export const state = reactive({
    loading: false,
    mdc: <iMdc | null>null,
    funcionarios: <iFuncionarios[]>[],
    caixasAbertos: <iCaixasAbertos[]>[],
    modalAbrirCaixaOpened: false,
});

export const funcionariosDisponiveis = computed(() =>
    state.funcionarios.filter(funcionario => {
        const temCaixaAberto = state.caixasAbertos.some(
            caixa => caixa.COD_FUNCIONARIO === funcionario.COD_FUNCIONARIO && caixa.STATUS === 1
        );
        return !temCaixaAberto;
    })
);

export const actions = {
    async init() {
        actions.getDadosAbrirCaixa()
    },

    abrirModal() {
        state.modalAbrirCaixaOpened = true
    },

    async getDadosAbrirCaixa() {
        try {
            state.loading = true;
            const data = await serviceAbrirCaixa.getDadosAbrirCaixa()
            state.mdc = data.mdc;
            state.funcionarios = data.funcionarios;
            state.caixasAbertos = data.caixasEmAberto;

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
                VALOR_TROCO: utils.formatValorUSA(valorTroco),
                LOGIN: state.funcionarios.find(f => f.COD_FUNCIONARIO === codFuncionario)?.LOGIN || ""
            }

            let caixasAberto = await serviceAbrirCaixa.abrirCaixa(param);
            state.caixasAbertos = caixasAberto;

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
    },

    getFotoFuncionarioURL(cpf: string) {
        if (!cpf) {
            return "";
        }

        const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
        return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
    },

    async redirecionarParaConferencia() {
        try {
            state.loading = true;

            window.parent.location = 'http://192.168.100.60/siap+/?p=conferencia_caixa/conferencia_caixa';
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao redirecionar para conferência de caixa"
            });
        } finally {
            state.loading = false
        }

    }
}