import { computed, reactive } from "vue";
import serviceRegrasFaturamento from "./services/regrasFaturamento.service";
import Swal from "sweetalert2";
import { iRegraFaturamento, iUpdateOrInsertRegraFaturamentoParam } from "./interfaces";
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

    async btnSave() {
        if (JSON.stringify(state.dbRegraFaturamento) != JSON.stringify(state.dbRegraFaturamentoOld)) {
            await actions.updateOrInsertRegraFaturamento();
        }

        state.btnAlterarActivated = false
    },

    async getRegraFaturamento() {
        try {
            state.loading = true;

            const data = await serviceRegrasFaturamento.getRegraFaturamento();

            state.dbRegraFaturamento = {
                FATURAMENTO_ACIMA_DE_VALOR: utils.formatValor(data.FATURAMENTO_ACIMA_DE_VALOR),
                FATURAMENTO_ATE_VALOR: utils.formatValor(data.FATURAMENTO_ATE_VALOR),
                FATURAMENTO_ACIMA_DE_PRAZO_1: data.FATURAMENTO_ACIMA_DE_PRAZO_1 || 0,
                FATURAMENTO_ACIMA_DE_PRAZO_2: data.FATURAMENTO_ACIMA_DE_PRAZO_2 || 0,
                FATURAMENTO_ACIMA_DE_PRAZO_3: data.FATURAMENTO_ACIMA_DE_PRAZO_3 || 0,
                FATURAMENTO_ATE_PRAZO_1: data.FATURAMENTO_ATE_PRAZO_1 || 0,
                FATURAMENTO_ATE_PRAZO_2: data.FATURAMENTO_ATE_PRAZO_2 || 0,
                FATURAMENTO_ATE_PRAZO_3: data.FATURAMENTO_ATE_PRAZO_3 || 0,
                ID_CLIENTE: data.ID_CLIENTE || null,
                ID_REGRA_FATURAMENTO: data.ID_REGRA_FATURAMENTO
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao buscar a regra de faturamento!",
                text: error.message
            })
        } finally {
            state.loading = false;
        }
    },

    async updateOrInsertRegraFaturamento() {
        try {
            state.loading = true;

            let param: iUpdateOrInsertRegraFaturamentoParam = {
                FATURAMENTO_ACIMA_DE_PRAZO_1: state.dbRegraFaturamento.FATURAMENTO_ACIMA_DE_PRAZO_1,
                FATURAMENTO_ACIMA_DE_PRAZO_2: state.dbRegraFaturamento.FATURAMENTO_ACIMA_DE_PRAZO_2,
                FATURAMENTO_ACIMA_DE_PRAZO_3: state.dbRegraFaturamento.FATURAMENTO_ACIMA_DE_PRAZO_3,
                FATURAMENTO_ACIMA_DE_VALOR: utils.formatValorUSA(computeds.acimaDeValor.value),
                FATURAMENTO_ATE_PRAZO_1: state.dbRegraFaturamento.FATURAMENTO_ATE_PRAZO_1,
                FATURAMENTO_ATE_PRAZO_2: state.dbRegraFaturamento.FATURAMENTO_ATE_PRAZO_2,
                FATURAMENTO_ATE_PRAZO_3: state.dbRegraFaturamento.FATURAMENTO_ATE_PRAZO_3,
                FATURAMENTO_ATE_VALOR: utils.formatValorUSA(state.dbRegraFaturamento.FATURAMENTO_ATE_VALOR.toString()),
                ID_CLIENTE: state.dbRegraFaturamento.ID_CLIENTE
            }

            const data = await serviceRegrasFaturamento.updateOrInsertRegraFaturamento(param);

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    text: data.msg,
                    timer: 1500,
                    showConfirmButton: false,
                })
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao alterar a regra de faturamento!",
                text: error.message
            })
        } finally {
            state.loading = false;
        }
    }
}

export const computeds = {
    acimaDeValor: computed(() => {
        if (state.dbRegraFaturamento.FATURAMENTO_ATE_VALOR) {
            const valor = utils.formatValorUSA(state.dbRegraFaturamento.FATURAMENTO_ATE_VALOR.toString()) + 0.01
            return utils.formatValor(valor)
        }
    })
}