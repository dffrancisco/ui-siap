import { reactive } from "vue";
import serviceRegrasFaturamento from "./services/regrasFaturamento.service";
import Swal from "sweetalert2";
import { iRegraFaturamento } from "./interfaces";
import utils from "@/ts/utils";

export const teste = true

export const state = reactive({
    loading: false,
    btnAlterarActivated: false,
    dbRegraFaturamento: <iRegraFaturamento>{},
    dbRegraFaturamentoOld: <iRegraFaturamento>{}
})

export const actions = {
    async init() {
        await actions.getRegraFaturamento()
    },

    async btnAlterar() {
        state.dbRegraFaturamentoOld = { ...state.dbRegraFaturamento }
        state.btnAlterarActivated = true
    },

    async btnCancelar() {
        state.dbRegraFaturamento = { ...state.dbRegraFaturamentoOld }
        state.btnAlterarActivated = false
    },

    async getRegraFaturamento() {
        try {
            state.loading = true;

            const data = await serviceRegrasFaturamento.getRegraFaturamento();

            state.dbRegraFaturamento = {
                ...data,
                FATURAMENTO_ACIMA_DE_VALOR: utils.formatValor(data.FATURAMENTO_ACIMA_DE_VALOR),
                FATURAMENTO_ATE_VALOR: utils.formatValor(data.FATURAMENTO_ATE_VALOR)
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar a regra de faturamento!",
            })
        } finally {
            state.loading = false;
        }
    }
}