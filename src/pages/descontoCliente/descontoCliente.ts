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
    modalMarca: <iModalCreate>{},
    dbCliente: <iCliente>{},
    dbMarca: <iMarca>{}, 
    dbMarcaAdicionada: <iMarcaAdicionada>{},
    pnSearch: false,
    loading: false,
    modalClienteOpened: false,
    modalMarcaOpened: false
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
        }),

        state.gridCliente = new xGridV2.create({
            el: "#pnClientes",
            height: 300,
            count: true,
            columns: {
                "CNPJ": {dataField: "CGC_CLIENTE"},
                "Cliente": {dataField: "NOME"},
            },
        })
    },

    criarModais() {
        state.modalCliente = new xModal.create({
            height: 450,
            width: 600,
            theme: "xModal-blue",
            el: '#mdCliente',
        }),
        state.modalMarca = new xModal.create({
            height: 195,
            width: 300,
            el: '#mdMarca',
        })
    },

    onClickClienteModal() {
        state.modalCliente.open()
    },
}

export default { state, actions }