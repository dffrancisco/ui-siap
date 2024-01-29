import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
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
    dbCliente: <iCliente>{},
    dbMarca: <iMarca>{}, 
    dbMarcaAdicionada: <iMarcaAdicionada>{},
    pnSearch: false,
    loading: false,
})

export const actions = {
    grids() {
        state.gridMarca = new xGridV2.create({
            el: "#pnMarcas",
            height: 400,
            count: true,
            theme:"x-grayV2",
            columns: {
                "Marcas": {dataField: "DESCRICAO"}
            },
        }),

        state.gridMarcaAdicionada = new xGridV2.create({
            el: "#pnMarcasAdicionadas",
            height: 400,
            count: true,
            theme:"x-grayV2",
            columns: {
                "Marcas": {dataField: "DESCRICAO"}
            },
        })
    }
}

