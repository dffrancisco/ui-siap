import { computed, nextTick, reactive } from "vue";
import serviceRegrasFaturamento from "./services/regrasFaturamento.service";
import Swal from "sweetalert2";
import {
    iInsertRegraFaturamentoParcelaParam,
    iRegraFaturamento, iRegraFaturamentoParcelas, iUpdateOrInsertRegraFaturamentoParam,
    iUpdateRegraFaturamentoParcelaParam
} from "./interfaces";
import utils from "@/ts/utils";
import xAuthManager from "@/plugins/xAuthManager";

export const state = reactive({
    loading: false,
    btnAlterarActivated: false,
    dbRegraFaturamento: <iRegraFaturamento>{},
    dbRegraFaturamentoOld: <iRegraFaturamento>{},
    dbRegraFaturamentoParcelas: <iRegraFaturamentoParcelas[]>[],
    modalCadastrarParcelaOpened: false,
    dbRegraFaturamentoParcelaToEdit: <iRegraFaturamentoParcelas>{},
    inputFaturamentoAte: <HTMLInputElement>{},
    modalFaturamentoExclusivoOpened: false,
    modalSelecionarClienteExclusivoOpened: false
})

export const actions = {
    async init() {
        state.inputFaturamentoAte = document.getElementById('inputFaturamentoAte') as HTMLInputElement

        await actions.getRegraFaturamento()
        await actions.getRegraFaturamentoParcelas()
    },

    async btnAlterar() {
        state.dbRegraFaturamentoOld = { ...state.dbRegraFaturamento }
        state.btnAlterarActivated = true
        await nextTick()

        state.inputFaturamentoAte.focus()
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

    async openModalCadastrarParcela() {
        state.dbRegraFaturamentoParcelaToEdit = {} as iRegraFaturamentoParcelas
        state.modalCadastrarParcelaOpened = true
    },

    async openModalCadastrarParcelaToEdit(dbParcela: iRegraFaturamentoParcelas) {
        state.dbRegraFaturamentoParcelaToEdit = { ...dbParcela }
        state.modalCadastrarParcelaOpened = true
    },

    async openModalFaturamentoExclusivo() {
        xAuthManager("Acesso ao faturamento exclusivo", (dados) => {
            state.modalFaturamentoExclusivoOpened = true
        });
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
    },

    async getRegraFaturamentoParcelas() {
        try {
            state.loading = true;

            const data = await serviceRegrasFaturamento.getRegraFaturamentoParcelas();

            state.dbRegraFaturamentoParcelas = data

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao buscar as parcelas da regra de faturamento!",
                text: error.message
            })
        } finally {
            state.loading = false;
        }
    },

    async deleteRegraFaturamentoParcela(idRegraFaturamentoParcela: number) {
        try {
            state.loading = true;

            const data = await serviceRegrasFaturamento.deleteRegraFaturamentoParcela(idRegraFaturamentoParcela);

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    text: data.msg,
                    timer: 1500,
                    showConfirmButton: false,
                })

                state.dbRegraFaturamentoParcelas = state.dbRegraFaturamentoParcelas.filter(parcela => {
                    return parcela.ID_REGRA_FATURAMENTO_PARCELA !== idRegraFaturamentoParcela;
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao excluir a parcela da regra de faturamento!",
                text: error.message
            })
        } finally {
            state.loading = false;
        }
    },

    async insertRegraFaturamentoParcela(dbRegraFaturamentoParcela: iRegraFaturamentoParcelas) {
        try {
            state.loading = true;

            let param: iInsertRegraFaturamentoParcelaParam = {
                DIVISAO: dbRegraFaturamentoParcela.DIVISAO,
                FATURAMENTO_ACIMA_DE_VALOR: utils.formatValorUSA(dbRegraFaturamentoParcela.FATURAMENTO_ACIMA_DE_VALOR.toString()),
                FATURAMENTO_ATE_VALOR: utils.formatValorUSA(dbRegraFaturamentoParcela.FATURAMENTO_ATE_VALOR.toString())
            }

            const data = await serviceRegrasFaturamento.insertRegraFaturamentoParcela(param);

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    text: data.msg,
                    timer: 1500,
                    showConfirmButton: false,
                })

                dbRegraFaturamentoParcela = {
                    ID_REGRA_FATURAMENTO_PARCELA: data.idRegraFaturamentoParcela,
                    DIVISAO: param.DIVISAO,
                    FATURAMENTO_ATE_VALOR: param.FATURAMENTO_ATE_VALOR,
                    FATURAMENTO_ACIMA_DE_VALOR: param.FATURAMENTO_ACIMA_DE_VALOR
                }

                state.dbRegraFaturamentoParcelas.push(dbRegraFaturamentoParcela)

                state.modalCadastrarParcelaOpened = false
            } else {
                Swal.fire({
                    icon: "warning",
                    text: data.msg
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao inserir a parcela na regra de faturamento!",
                text: error.message
            })
        } finally {
            state.loading = false;
        }
    },

    async updateRegraFaturamentoParcela(dbRegraFaturamentoParcela: iRegraFaturamentoParcelas) {
        try {
            state.loading = true;

            let param: iUpdateRegraFaturamentoParcelaParam = {
                DIVISAO: dbRegraFaturamentoParcela.DIVISAO,
                FATURAMENTO_ACIMA_DE_VALOR: utils.formatValorUSA(dbRegraFaturamentoParcela.FATURAMENTO_ACIMA_DE_VALOR.toString()),
                FATURAMENTO_ATE_VALOR: utils.formatValorUSA(dbRegraFaturamentoParcela.FATURAMENTO_ATE_VALOR.toString()),
                ID_REGRA_FATURAMENTO_PARCELA: dbRegraFaturamentoParcela.ID_REGRA_FATURAMENTO_PARCELA
            }

            const data = await serviceRegrasFaturamento.updateRegraFaturamentoParcela(param);

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    text: data.msg,
                    timer: 1500,
                    showConfirmButton: false,
                })

                state.dbRegraFaturamentoParcelas = state.dbRegraFaturamentoParcelas.map(parcela => {
                    if (parcela.ID_REGRA_FATURAMENTO_PARCELA === dbRegraFaturamentoParcela.ID_REGRA_FATURAMENTO_PARCELA) {
                        return {
                            ...parcela,
                            DIVISAO: param.DIVISAO,
                            FATURAMENTO_ACIMA_DE_VALOR: param.FATURAMENTO_ACIMA_DE_VALOR,
                            FATURAMENTO_ATE_VALOR: param.FATURAMENTO_ATE_VALOR
                        }
                    }
                    return parcela
                })

                state.modalCadastrarParcelaOpened = false
            } else {
                Swal.fire({
                    icon: "warning",
                    text: data.msg
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao alterar a parcela da regra de faturamento!",
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