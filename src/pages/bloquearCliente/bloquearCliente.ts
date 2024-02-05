import { reactive } from 'vue';
import $ from 'jquery';
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2'
import xModal, { iModalCreate } from '@/plugins/xModal/xModal';
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from '@/ts/utils';
import moment from 'moment';

import { iBloqueioCliente, iCliente, iParamGetBloqueioCliente, iBloqueioClienteForm } from './interfaces';
import serviceBloquearCliente from "./services/bloquearCliente.service";

export const state = reactive({
    gridBloqueioCliente: <ixGridCreate>{},
    modalCliente: <iModalCreate>{},
    modalBloquearCliente: <iModalCreate>{},

    dbClienteSelecionado: <iCliente>{},
    dbBloqueioCliente: <iBloqueioCliente>{},

    modalClienteOpened: false,

    loading: false,

    btnBlockDisabled: true,
    btnUnlockDisabled: true
})

export const actions = {
    grids() {
        state.gridBloqueioCliente = new xGridV2.create({
            el: "#gridBloqueioCliente",
            height: 250,
            columns: {
                'Data do Bloqueio': { dataField: 'DATA_BLOQUEIO', width: "17%", center: true, render: utils.dataBrasil },
                'Data do Desbloqueio': { dataField: 'DATA_DESBLOQUEIO', width: "17%", center: true, render: utils.dataBrasil },
                'Observação': { dataField: 'OBS' }
            },
            query: {
                async execute(rs) {
                    let data = await actions.getBloqueioCliente({
                        offset: rs.offset,
                        param: rs.param,
                    });
                    state.gridBloqueioCliente.querySourceAdd(data);
                },
            }
        })
    },

    criarModais() {
        state.modalCliente = new xModal.create({
            el: '#modalCliente',
            height: 370,
            width: 700,
            theme: 'xModal-blue',
            onOpen: () => { state.modalClienteOpened = true },
            onClose: () => { state.modalClienteOpened = false }
        })

        state.modalBloquearCliente = new xModal.create({
            el: "#modalBloquearCliente",
            height: 175,
            width: 300,
            theme: 'xModal-blue'
        })
    },

    init() {
        $(".ss").attr("autocomplete", "off");

        actions.grids();
        actions.criarModais();
    },

    modalClienteOpen() {
        state.modalCliente.open();
    },

    modalClienteClose() {
        state.modalCliente.close();
    },

    modalBloquearClienteOpen() {

        let dados = <any>state.gridBloqueioCliente.data()

        for (let i = 0; i < dados.length; i++) {
            const dataBloqueio = moment(dados[i].DATA_BLOQUEIO)

            if (moment().isSame(dataBloqueio, 'day')) {
                Swal.fire({
                    icon: 'warning',
                    text: 'Não é possível incluir mais de um bloqueio para o mesmo cliente no mesmo dia!'
                })
                return
            }
        }

        state.modalBloquearCliente.open();
    },

    modalBloquearClienteClose() {
        state.modalBloquearCliente.close();
    },

    selecionarCliente(cliente: iCliente) {
        state.dbClienteSelecionado = {
            ...cliente
        }

        if (cliente.BLOQUEADO == 0) {
            state.btnBlockDisabled = false
            state.btnUnlockDisabled = true
        } else {
            state.btnUnlockDisabled = false
            state.btnBlockDisabled = true
        }

        state.gridBloqueioCliente.queryOpen({
            ID_CLIENTE: cliente.ID_CLIENTE,
        });

        state.modalCliente.close()
    },

    async getBloqueioCliente({ offset, param }: iParamGetBloqueioCliente) {
        try {
            state.loading = true
            const data = await serviceBloquearCliente.getBloqueioCliente({ offset, param })
            state.loading = false
            return data
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: 'error',
                text: 'Erro ao carregar os clientes bloqueados!'
            })
        }
    },

    async bloquearCliente(bloqueioCliente: iBloqueioClienteForm) {
        try {

            let idCliente = state.dbClienteSelecionado.ID_CLIENTE
            let observacao = bloqueioCliente.OBS

            let dadosBloqueio = {
                ID_CLIENTE: idCliente,
                OBS: observacao
            }

            if (await msgConfirm("Confirmação", "Confirma o bloqueio deste cliente?")) {

                state.loading = true

                const data = await serviceBloquearCliente.bloquearCliente(dadosBloqueio)

                state.btnUnlockDisabled = false
                state.btnBlockDisabled = true

                state.gridBloqueioCliente.queryOpen({
                    ID_CLIENTE: idCliente,
                });

                state.loading = false

                state.modalBloquearCliente.close();

                return data

            }

        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: 'error',
                text: 'Erro ao bloquear o cliente!'
            })
        }


    },

    async desbloquearCliente() {
        try {
            const bloqueioCliente = state.gridBloqueioCliente.dataSource();

            if (!bloqueioCliente) {
                Swal.fire({
                    icon: 'warning',
                    text: 'Nenhum bloqueio selecionado!'
                })
                return
            }

            if (bloqueioCliente.DATA_DESBLOQUEIO) {
                Swal.fire({
                    icon: 'warning',
                    text: 'É necessário selecionar a data com bloqueio!'
                })
                return
            }

            let idBloqueioCliente = state.dbClienteSelecionado.ID_CLIENTE
            let dataBloqueio = bloqueioCliente.DATA_BLOQUEIO

            let dadosDesbloqueio = {
                ID_CLIENTE: idBloqueioCliente,
                DATA_BLOQUEIO: dataBloqueio
            }

            if (await msgConfirm("Confirmação", "Confirma o desbloqueio deste cliente?")) {
                state.loading = true

                const data = await serviceBloquearCliente.desbloquearCliente(dadosDesbloqueio)

                state.gridBloqueioCliente.queryOpen({
                    ID_CLIENTE: idBloqueioCliente,
                });

                state.btnUnlockDisabled = true
                state.btnBlockDisabled = false

                state.loading = false

                return data
            }

        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: 'error',
                text: 'Erro ao desbloquear o cliente!'
            })
        }
    }

}