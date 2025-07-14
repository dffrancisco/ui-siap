import Swal from "sweetalert2";
import { reactive } from "vue";
import utils from "@/ts/utils";

import { iCredito } from "./interfaces";
import desbloqueioCreditoService from "./services/desbloqueioCredito.service";

export const state = reactive({
    credito: <iCredito>{},
    chave: "",
    loading: false,
});

export const actions = {
    async init() { },

    async getCredito(param: string) {

        if (!state.chave) {
            Swal.fire({
                icon: "warning",
                title: "Chave inválida",
                text: "certifique-se de que o campo não está em branco.",
            });
            state.loading = false;

            return;
        }

        try {
            state.loading = true;
            state.credito = await desbloqueioCreditoService.getCredito(param);

        } catch (err: any) {
            Swal.fire({
                icon: "error",
                text: err?.response?.data?.msg || "Ocorreu um erro ao buscar o crédito.",
            });
        }

        state.loading = false;
        state.chave = "";
    },

    onClickConfirmarDesbloqueio() {
        utils.confirmaCodigo({
            msg: `Deseja liberar o crédito ${state.credito.CHAVE}?`,
            theme: "xModal-bublue",
            call: async () => {
                try {
                    state.loading = true;
                    await desbloqueioCreditoService.desbloquearCredito(state.credito.CHAVE);

                    state.loading = false;

                    await Swal.fire({
                        icon: "success",
                        title: "Crédito desbloqueado com sucesso!",
                    });

                    state.chave = "";
                    state.credito = {} as iCredito;

                } catch (error: any) {
                    state.loading = false;

                    Swal.fire({
                        icon: "error",
                        text: error?.response?.data?.msg || "Ocorreu um erro ao desbloquear o crédito.",
                    });
                }

            },
        });
    },
};
