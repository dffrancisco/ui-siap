import Swal from "sweetalert2";
import { computed, reactive } from "vue";
import utils, { confirmaCodigo } from "../../ts/utils";


import { iCredito } from './interfaces'
import desbloqueioCreditoService from './services/desbloqueioCredito.service';
import { stat } from 'fs';


export const state = reactive({
    credito: <iCredito>{},
    pesquisaCredito: "",
    abrirModalConfirmar: false,
    botaoDesbloquearCredito: true,

});

export const actions = {
    async init() {

    },

    async getCredito(param: String) {
        if (!state.pesquisaCredito || state.pesquisaCredito.length !== 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Chave inválida',
                text: 'certifique-se de que o campo não está em branco e se possuem 10 caracteres.',
            });
            return;
        }

        try {
            state.credito = await desbloqueioCreditoService.getCredito(param);
            state.botaoDesbloquearCredito = false;

        } catch (err) {
            let mensagem = 'Erro ao armazenar os dados';

            if (err.response?.data?.message) {
                mensagem = err.response.data.message;
            } else if (err.message) {
                mensagem = err.message;
            }

            Swal.fire({
                icon: 'info',
                title: 'Esse crédito não está bloqueado',
            });
        }
    },

    // async updateCredito(param) {
    //     //código oficial
    //     try {
    //         await desbloqueioCreditoService.updateCredito(param);
    //         state.abrirModalConfirmar = false
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Crédito desbloqueado',
    //         });

    //         await actions.LimpaCampos()


    //     } catch {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Erro no processamento',
    //         });
    //     }
    //     // fim código oficial
    // },

    AbreModalConfirmar() {
        state.abrirModalConfirmar = !state.abrirModalConfirmar;
    },

    async LimpaCampos() {
        state.credito = {} as iCredito
        state.pesquisaCredito = ""
        state.abrirModalConfirmar = false
        state.botaoDesbloquearCredito = true
    },

    //teste
    onClickConfirmaDesbloqueio() {
        utils.confirmaCodigo({
            msg: `Deseja liberar o crédito ${state.credito.CHAVE}?`,
            theme: 'xModal-blue',
            call: async (param) => {
                 {
                    try {
                        await desbloqueioCreditoService.updateCredito(param);
                        state.abrirModalConfirmar = false
                        Swal.fire({
                            icon: 'success',
                            title: 'Crédito desbloqueado',
                        });

                        await actions.LimpaCampos()


                    } catch {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro no processamento',
                        });
                    }
                }
            }
        })

    }
    // fim teste

};


