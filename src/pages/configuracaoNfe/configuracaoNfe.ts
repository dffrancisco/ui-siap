
import { reactive, nextTick, computed } from "vue";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import serviceNfe from './services/configuracaoNfe.service';
import { iNfeConfig, iCofins, iPis, iRegimeTributario } from "./interfaces";

export const state = reactive({
    nfeConfig: {} as iNfeConfig,
    pis: {} as iPis,
    cofins: {} as iCofins,
    regimeTributario: {} as iRegimeTributario,

    nfeConfigLista: [] as iNfeConfig[],
    cofinsLista: [] as iCofins[],
    pisLista: [] as iPis[],
    regimeTributarioLista: [] as iRegimeTributario[],

    pisSelecionado: {} as iPis,
    cofinsSelecionado: {} as iCofins,

    loading: false,
    isEditable: false,
    originalConfig: {} as iNfeConfig,
});

export const pisSelecionado = computed(() => {
    const regimeId = Number(state.nfeConfig.REGIME_TRIBUTARIO);
    return state.pisLista.find(p => p.ID_REGIME_TRIBUTARIO === regimeId) || {} as iPis;
});

export const cofinsSelecionado = computed(() => {
    const regimeId = Number(state.nfeConfig.REGIME_TRIBUTARIO);
    return state.cofinsLista.find(c => c.ID_REGIME_TRIBUTARIO === regimeId) || {} as iCofins;
});

export const regimeTributarioSelecionado = computed({
    get: () => {
        return (
            regimeTributarioOptions.find(
                (option) => String(option.value) === String(state.nfeConfig.REGIME_TRIBUTARIO)
            ) || { text: "", value: null }
        );
    },
    set: (newValue) => {
        state.nfeConfig.REGIME_TRIBUTARIO = String(newValue.value);
    },
});


export const stateTabs = reactive({
    selectedTab: "configuracaoNfe",
});

export const regimeTributarioOptions = [
    { text: "Simples Nacional", value: 0 },
    { text: "Lucro Presumido", value: 1 },
    { text: "Lucro Real", value: 2 }
];

export const actions = {
    async init() {
        await actions.getDadosParaInputs();
    },

    async getDadosParaInputs() {
        try {
            state.loading = true;

            const data = await serviceNfe.getDadosParaInputs();

            state.nfeConfig = data.nfeConfig[0];
            state.regimeTributarioLista = data.regimeTributario;
            state.pisLista = data.pis;
            state.cofinsLista = data.cofins;

            const regimeId = Number(state.nfeConfig.REGIME_TRIBUTARIO);
            state.pis = state.pisLista.find(p => p.ID_REGIME_TRIBUTARIO === regimeId) || {} as iPis;
            state.cofins = state.cofinsLista.find(c => c.ID_REGIME_TRIBUTARIO === regimeId) || {} as iCofins;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os dados iniciais!",
            });
        } finally {
            state.loading = false;
        }
    },
    btnEdit() {
        state.isEditable = true;
        nextTick(() => {
            const firstInput = document.querySelector('input');
            firstInput?.focus();
        });
    },
    async toUpdate() {
        try {
            const param: iNfeConfig = {
                ID_NFE_CONFIG: state.nfeConfig.ID_NFE_CONFIG,
                LOCAL_XML: state.nfeConfig.LOCAL_XML?.toUpperCase(),
                LOCAL_PDF: state.nfeConfig.LOCAL_PDF?.toUpperCase(),
                REGIME_TRIBUTARIO: state.nfeConfig.REGIME_TRIBUTARIO,
                CFOP_TRANSP: state.nfeConfig.CFOP_TRANSP,
                CFOP_MONTAGEM_INTERNO: state.nfeConfig.CFOP_MONTAGEM_INTERNO,
                CFOP_MONTAGEM_INTERESTADUAL: state.nfeConfig.CFOP_MONTAGEM_INTERESTADUAL,
                EMIT_IM: state.nfeConfig.EMIT_IM,
                EMIT_CNAE: state.nfeConfig.EMIT_CNAE,
                PROD_CEST: state.nfeConfig.PROD_CEST,
                CFOP_ECF_INTERNO: state.nfeConfig.CFOP_ECF_INTERNO,
                CFOP_ECF_INTERESTADUAL: state.nfeConfig.CFOP_ECF_INTERESTADUAL,
                CST: state.nfeConfig.CST,
                CFOP_DEV_INTERNO: state.nfeConfig.CFOP_DEV_INTERNO,
                CFOP_DEV_INTERESTADUAL: state.nfeConfig.CFOP_DEV_INTERESTADUAL,
                COD_LISTA_SERVICO: state.nfeConfig.COD_LISTA_SERVICO,
                NCM_MONTAGEM_GERAL: state.nfeConfig.NCM_MONTAGEM_GERAL,
            };

            const updatePayload = {
                nfeConfig: param,
                pis: state.pis,
                cofins: state.cofins
            };

            state.loading = true;
            await serviceNfe.updateNfeConfig(updatePayload);

            await Swal.fire({
                icon: "success",
                text: "Configuração atualizada com sucesso.",
            });

            state.originalConfig = { ...param };
            state.isEditable = false;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar configuração!",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },

    async btnSave() {
        if (await utils.validaOBR()) return;

        await actions.toUpdate();
    },

    btnCancel() {
        state.isEditable = false;
    },
};

export default { state, actions };