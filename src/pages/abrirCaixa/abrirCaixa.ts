import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceAbrirCaixa from "./services/abrirCaixa.service";
import { iCaixasAbertos, iFuncionarios, iMdc, iParamFecharCaixa, iParamsAbrirCaixa } from "./interfaces";
import xAuthManager from "@/plugins/xAuthManager";

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

    abrirModal() {
        // Capturar os COD_FUNCIONARIOS de state.caixasAbertos
        const funcionariosEmCaixa = state.caixasAbertos.map(caixa => caixa.COD_FUNCIONARIO);

        // Filtrar os funcionários para remover os que já estão associados a uma caixa
        state.funcionarios = state.funcionarios.filter(funcionario =>
            !funcionariosEmCaixa.includes(funcionario.COD_FUNCIONARIO)
        );
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
                VALOR_TROCO: parseFloat(valorTroco),
                LOGIN: state.funcionarios.find(f => f.COD_FUNCIONARIO === codFuncionario)?.LOGIN || ""
            }

            let caixaAberto = await serviceAbrirCaixa.abrirCaixa(param);
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
    },

    getFotoFuncionarioURL(cpf: string) {
        if (!cpf) {
            return "";
        }

        const cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
        return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
    },

    async fecharCaixa(funcionario) {

        let param: iParamFecharCaixa = {
            ID_ABERTURA_CAIXA: funcionario.ID_ABERTURA_CAIXA
        }

        xAuthManager("Autorizar fechamento de caixa?", async () => {
            try {
                state.loading = true;

                let fecharCaixa = await serviceAbrirCaixa.fecharCaixa(param);
                state.caixasAbertos = fecharCaixa;
                Swal.fire({
                    icon: "success",
                    title: "Caixa fechado com sucesso.",
                    showConfirmButton: false,
                    timer: 1000,
                });

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Erro ao fechar o caixa"
                });
            } finally {
                state.loading = false
            }
        });
    }
}