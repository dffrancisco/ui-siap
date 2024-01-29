import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from '@/plugins/xModal/xModal';
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";

import { iCliente, iMarca, iMarcaAdicionada } from "./interfaces";

interface _iClientexGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iCliente;
}

interface _iMarcaxGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iMarca;
}

interface _iMarcaAdicionadaxGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iMarcaAdicionada;
}

export const state = reactive({
    gridCliente: <_iClientexGridCreate>{},
    gridMarca: <_iMarcaxGridCreate>{},
    gridMarcaAdicionada: <_iMarcaAdicionadaxGridCreate>{},
    modalCliente: <iModalCreate>{},
    modalAdicionarMarca: <iModalCreate>{},
    dbCliente: <iCliente>{},
    dbMarca: <iMarca>{}, 
    dbMarcaAdicionada: <iMarcaAdicionada>{},

    pnSearch: false,
    loading: false,
    modalClienteOpened: false,
    modalAdicionarMarcaOpened: false,
    clienteDisabled: false,

    configVMoney: {
        thousands: '.',
        decimal: ',',
        precision: 2,
      }
})

export const actions = {
    grids() {
        state.gridMarca = new xGridV2.create({
            el: "#pnMarcas",
            height: 400,
            count: true,
            columns: {
                "Marca": {dataField: "DESCRICAO"}
            },
        }),

        state.gridMarcaAdicionada = new xGridV2.create({
            el: "#pnMarcasAdicionadas",
            height: 400,
            count: true,
            columns: {
                "Marca": {dataField: "DESCRICAO"},
                "Desconto %": {dataField: "DESCONTO"},
                "Data Inicial": {dataField: "DATA_INICIAL"},
                "Data Final": {dataField: "DATA_FINAL"},
            },
            sideBySide: {
                el: "#marcasAdicionadasCampos",
                frame: {
                    el:"#btnMarcasAdicionadas",
                    buttons: {
                        Cancel: {
                            html: "Cancelar",
                            state: "select",
                            click: actions.btnCancelAdicionarMarca,
                            preLoad: "Cancelando o cliente",
                        },
                        Ok: {
                            html: "OK",
                            state: "select",
                            click: actions.btnSelectAdicionarMarca,
                            preLoad: "Selecionando o cliente",
                        },
                    }
                }
            }
        }),

        state.gridCliente = new xGridV2.create({
            el: "#pnClientes",
            height: 175,
            count: true,
            columns: {
                "CNPJ": {dataField: "CGC_CLIENTE"},
                "Cliente": {dataField: "NOME"},
            },
            sideBySide: {
                el: "#clienteCampos",
                frame: {
                    el: "#btnClientes",
                    buttons: {
                        Cancel: {
                            html: "Cancelar",
                            state: "select",
                            click: actions.btnCancelCliente,
                            preLoad: "Cancelando o cliente",
                        },
                        Ok: {
                            html: "OK",
                            state: "select",
                            click: actions.btnSelectCliente,
                            preLoad: "Selecionando o cliente",
                        },
                    }
                }
            }
        })
    },

    criarModais() {
        state.modalCliente = new xModal.create({
            height: 341,
            width: 600,
            theme: "xModal-blue",
            el: '#mdCliente',
        }),
        state.modalAdicionarMarca = new xModal.create({
            height: 215,
            width: 340,
            el: '#mdAdicionarMarca',
            theme: "xModal-blue",
        })
    },

    onClickClienteModal() {
        state.modalCliente.open()
    },

    onClickAdicionarMarcaModal() {
        state.modalAdicionarMarca.open()
    },
}

export default { state, actions }