
import { reactive, nextTick } from "vue";
import Swal from "sweetalert2";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
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
            state.pisSelecionado = state.pisLista.find(p => p.ID_REGIME_TRIBUTARIO === regimeId) || {} as iPis;
            state.cofinsSelecionado = state.cofinsLista.find(c => c.ID_REGIME_TRIBUTARIO === regimeId) || {} as iCofins;

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


    async btnSave() {
        if (utils.validaOBR()) return;

        try {
            state.loading = true;
            await serviceNfe.updateNfeConfig(state.nfeConfig);

            Swal.fire({
                icon: "success",
                text: "Configurações salvas com sucesso!",
            });
            state.originalConfig = { ...state.nfeConfig };
            state.isEditable = false;
        } catch (error) {


        } finally {
            state.loading = false;
        }
    },

    btnCancel() {
        state.isEditable = false;
    },


};

export default { state, actions };