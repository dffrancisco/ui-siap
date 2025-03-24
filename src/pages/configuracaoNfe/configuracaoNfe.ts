
import { reactive, nextTick } from "vue";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import serviceNfe from './services/configuracaoNfe.service';
import { iCidades, iNfeConfig, iCofins, iPis, iRegimeTributario, iResponseDadosInputs } from "./interfaces";

export const state = reactive({
    nfeConfig: {} as iNfeConfig,
    pisLista: [] as iPis[],
    cofinsLista: [] as iCofins[],
    regimeTributarioLista: [] as iRegimeTributario[],
    loading: false,
    isEditing: false,
    cidades: <iCidades[]>[],
    originalConfig: {} as iNfeConfig,
});

export const actions = {
    async init() {
    },

    async getDadosParaInputs() {
        try {
            state.loading = true;

            const data = await serviceNfe.getDadosParaInputs();
            state.cidades = data.cidades
            state.nfeConfig = data.nfeConfig[0];
            state.regimeTributarioLista = data.regimeTributario;
            state.pisLista = data.pis;
            state.cofinsLista = data.cofins;

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