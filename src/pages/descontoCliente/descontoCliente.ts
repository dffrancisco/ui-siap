import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from '@/plugins/xModal/xModal';
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";

import serviceDescontoCliente from "./services/descontoCliente.service"

import { iCliente, iMarca, iMarcaAdicionada, iParamGetClientes, iParamGetMarcas } from "./interfaces";

interface _iMarcaxGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iMarca;
}

interface _iMarcaAdicionadaxGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iMarcaAdicionada;
}

export const state = reactive({
    gridCliente: <ixGridCreate>{},
    gridMarca: <_iMarcaxGridCreate>{},
    gridMarcaAdicionada: <_iMarcaAdicionadaxGridCreate>{},
    edtMarcaSearch: <HTMLInputElement>{},

    modalCliente: <iModalCreate>{},
    modalAdicionarMarca: <iModalCreate>{},

    dbCliente: <iCliente>{},
    dbClienteSelecionado: <iCliente>{},

    dbMarca: <iMarca>{},

    dbMarcaAdicionada: <iMarcaAdicionada>{},

    loading: false,
    modalClienteOpened: false,
    modalAdicionarMarcaOpened: false,
    pnSearch: false,

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
            columns: {
                "Marca": { dataField: "DESCRICAO" }
            },
            query: {
                async execute(rs) {
                    let data = await actions.getMarcas({
                        offset: rs.offset,
                        param: rs.param
                    })
                    state.gridMarca.querySourceAdd(data)
                }
            },
        }),

        state.gridMarcaAdicionada = new xGridV2.create({
            el: "#pnMarcasAdicionadas",
            height: 400,
            count: true,
            columns: {
                "Marca": { dataField: "DESCRICAO" },
                "Desconto %": { dataField: "DESCONTO" },
                "Data Inicial": { dataField: "DATA_INICIAL" },
                "Data Final": { dataField: "DATA_FINAL" },
            },
            sideBySide: {
                el: "#marcasAdicionadasCampos",
                frame: {
                    el: "#btnMarcasAdicionadas",
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
        })
    },

    criarModais() {
        state.modalCliente = new xModal.create({
            height: 341,
            width: 600,
            theme: "xModal-blue",
            el: '#modalCliente',
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

    onClickCloseClienteModal() {
        state.modalCliente.close()
    },

    onClickAdicionarMarcaModal() {
        state.modalAdicionarMarca.open()
    },

    searchMarcas() {
        state.gridMarca.queryOpen({
            DESCRICAO: state.edtMarcaSearch.value.toUpperCase(),
        });
    },

    setarCliente(cliente: iCliente) {
        state.modalCliente.close()
        state.dbClienteSelecionado = {
            ID_CLIENTE: cliente.ID_CLIENTE,
            NOME: cliente.NOME,
            CGC_CLIENTE: cliente.CGC_CLIENTE,
            QTD: cliente.QTD
        }
    },

    async getMarcas({ offset, param }: iParamGetMarcas) {
        try {
            state.loading = true
            const data = await serviceDescontoCliente.getMarcas({ offset, param });
            state.loading = false

            return data
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar as marcas!"
            })
        }
    }

}

export default { state, actions }