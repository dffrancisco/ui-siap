import { reactive } from 'vue';
import $ from 'jquery';
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2'
import xModal, { iModalCreate } from '@/plugins/xModal/xModal';
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iBloqueioCliente, iCliente } from './interfaces';

export const state = reactive({
    gridBloqueioCliente: <ixGridCreate>{},
    modalCliente: <iModalCreate>{},
    modalBloquearCliente: <iModalCreate>{},

    dbClienteSelecionado: <iCliente>{},
    dbBloqueioCliente: <iBloqueioCliente>{},

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
                'Data do Bloqueio': {dataField: 'DATA_BLOQUEIO', width: "20%", center: true},
                'Data do Desbloqueio': {dataField: 'DATA_DESBLOQUEIO', width: "20%", center: true},
                'Observação': {dataField: 'OBS'}
            },
        })
    },

    criarModais() {
        state.modalCliente = new xModal.create({
            el: '#modalCliente',
            height: 342,
            width: 600,
            theme: 'xModal-blue'
        },)

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

    modalClienteOpen(){
        state.modalCliente.open();
    },

    modalClienteClose(){
        state.modalCliente.close();
    },

    modalBloquearClienteOpen(){
        state.modalBloquearCliente.open();
    },

    modalBloquearClienteClose(){
        state.modalBloquearCliente.close();
    },

}

