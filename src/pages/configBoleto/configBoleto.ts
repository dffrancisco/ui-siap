import Swal from "sweetalert2";
import { computed, reactive, ref, watch } from "vue";
import serviceConfigBoleto from "./services/configBoleto.service";
import { iCarteiraBradesco, iDadosBoleto, iParamUpdateConfigBoleto } from "./interfaces";
import utils, { msgConfirmSemCodigo } from "@/ts/utils";

export const state = reactive({
    loading: false,
    carteiraBancoBradesco: [] as iCarteiraBradesco[],
    dadosBoleto: {} as iDadosBoleto,
    botaoAlterarHabilitado: true,
    botaoSalvarHabilitado: false,
    botaoCancelarHabilitado: false,
});

export const selectedCarteira = ref("");

export const actions = {
    init() {
        actions.getDadosIniciaisConfigBoleto();
    },

    async getDadosIniciaisConfigBoleto() {
        try {
            state.loading = true;

            let dadosConfigBoleto = await serviceConfigBoleto.getDadosIniciaisConfigBoleto();
            state.carteiraBancoBradesco = dadosConfigBoleto.carteiraBancoBradesco;
            state.dadosBoleto = dadosConfigBoleto.dadosBoleto;

            selectedCarteira.value = state.dadosBoleto.CARTEIRA;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar as informações de configuração do boleto",
            });
        } finally {
            state.loading = false;
        }
    },

    alterar() {
        state.botaoAlterarHabilitado = false;
        state.botaoSalvarHabilitado = true;
        state.botaoCancelarHabilitado = true;

        const inputBanco = document.querySelector("#banco") as HTMLElement;
        setTimeout(() => {
            inputBanco.focus();
        }, 100);
    },

    salvar() {
        state.botaoAlterarHabilitado = true;
        state.botaoSalvarHabilitado = false;
        state.botaoCancelarHabilitado = false;

        if (!state.dadosBoleto.BANCO ||
            !state.dadosBoleto.AGENCIA ||
            !state.dadosBoleto.CONTA_BANCARIA ||
            !state.dadosBoleto.CARTEIRA ||
            !state.dadosBoleto.JUROS ||
            !state.dadosBoleto.OBS_BOLETO) {
            Swal.fire({
                icon: "warning",
                text: "Preencha todos os dados antes de salvar!",
            });
            actions.alterar()
            return false
        }

        actions.updateConfigBoleto()
    },

    cancelar() {
        state.botaoAlterarHabilitado = true;
        state.botaoSalvarHabilitado = false;
        state.botaoCancelarHabilitado = false;
    },

    async updateConfigBoleto() {

        let param = {
            banco: state.dadosBoleto.BANCO,
            agencia: state.dadosBoleto.AGENCIA,
            contaBancaria: state.dadosBoleto.CONTA_BANCARIA,
            carteira: state.dadosBoleto.CARTEIRA,
            juros: state.dadosBoleto.JUROS,
            obsBoleto: state.dadosBoleto.OBS_BOLETO
        }

        if (await msgConfirmSemCodigo("Confirmação", "Deseja alterar os dados do configuração do boleto?")) {

            try {
                state.loading = true
                await serviceConfigBoleto.updateConfigBoleto(param as iParamUpdateConfigBoleto)

                Swal.fire({
                    icon: "success",
                    title: "Dados alterados com sucesso!",
                });

                actions.cancelar()

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Erro ao alterar os dados de boleto",
                });
            } finally {
                state.loading = false

            }
        }
    },
};

export const computeds = {
    codigoEscritural: computed(() => {
        const carteiraSelecionada = state.carteiraBancoBradesco.find(
            (carteira) => carteira.NUM_CARTEIRA === selectedCarteira.value
        );
        return carteiraSelecionada?.CODIGO_ESCRITURAL || "";
    }),

    digitoCodigoEscritural: computed(() => {
        const carteiraSelecionada = state.carteiraBancoBradesco.find(
            (carteira) => carteira.NUM_CARTEIRA === selectedCarteira.value
        );
        return carteiraSelecionada?.DIGITO_CODIGO_ESCRITURAL || "";
    }),
};

watch(selectedCarteira, (newValue) => {
    state.dadosBoleto.CARTEIRA = newValue;
});