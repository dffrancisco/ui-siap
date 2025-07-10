import Swal from "sweetalert2";
import { reactive } from "vue";
import utils from "@/ts/utils";

import { iCredito } from './interfaces'
import desbloqueioCreditoService from './services/desbloqueioCredito.service';

export const state = reactive({
    credito: <iCredito>{},
    pesquisaCredito: "" as string,
    loading: false,

});

export const actions = {
    async init() {



    },

    async getCredito(param: string) {
        if (!state.pesquisaCredito || state.pesquisaCredito.length !== 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Chave inválida',
                text: 'certifique-se de que o campo não está em branco.',
            });
            return;
        }

        try {
            state.credito = await desbloqueioCreditoService.getCredito(param);
            return

        } catch (err: any) {
            if (err.response?.data?.message) {
                ;
            } else if (err.message) {
            }

            Swal.fire({
                icon: 'info',
                title: 'Esse crédito não está bloqueado',
            });
        }
    },

    onClickConfirmaDesbloqueio() {
        utils.confirmaCodigo({
            msg: `Deseja liberar o crédito ${state.credito.CHAVE}?`,
            theme: 'xModal-bublue',
            call: async () => {

                try {
                    state.loading = true // verdadeiro
                    await desbloqueioCreditoService.updateCredito(state.credito.CHAVE);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Crédito desbloqueado',
                    });
                    
                    state.credito = {} as iCredito

                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao processar sua solicitação.',
                    });
                } finally {
                    state.loading = false // falso
                    console.log(state.loading)
                }
            }
        })
    }

};


