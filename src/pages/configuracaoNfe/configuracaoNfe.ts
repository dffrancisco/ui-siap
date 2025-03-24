
import { reactive, nextTick } from "vue";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import serviceNfe from './services/configuracaoNfe.service';
import { iNfeConfig } from "../interfaces";

export const state = reactive({
    nfeConfig: {} as iNfeConfig,
    loading: false,
    isEditing: false,

    originalConfig: {} as iNfeConfig,
});

export const actions = {
    async init() {
        actions.getNfeConfig();
    },

    async getNfeConfig() {
        state.loading = true;

        try {
            const data = await serviceNfe.getNfeConfig();
            state.nfeConfig = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar as configurações de NFe.",
            });
            return;
        } finally {
            state.loading = false;
        }

        state.loading = false;
    },

    async getPis() {
        state.loading = true;

        try {
            const data = await serviceNfe.getPis();
            state.nfeConfig.pis = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar informações de PIS.",
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async getCofins() {
        state.loading = true;

        try {
            const data = await serviceNfe.getCofins();
            state.nfeConfig.cofins = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar informações de COFINS.",
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async getRegimeTributario() {
        state.loading = true;

        try {
            const data = await serviceNfe.getRegimeTributario();
            state.nfeConfig.regimeTributario = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar informações de Regime Tributário.",
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    btnEdit() {
        state.isEditing = true;
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
            state.isEditing = false;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error.response?.data?.msg || "Erro ao salvar configurações",
            });
        } finally {
            state.loading = false;
        }
    },

    btnCancel() {
        state.nfeConfig = { ...state.originalConfig };
        state.isEditing = false;
    },
};

export default { state, actions };