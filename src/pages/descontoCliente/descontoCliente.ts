import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from '@/plugins/xModal/xModal';
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";

import serviceDescontoCliente from "./services/descontoCliente.service"

import { iCliente, iMarca, iMarcaAdicionada, iParamGetClientes } from "./interfaces";

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

    edtClienteSearch: <HTMLInputElement>{},

    modalCliente: <iModalCreate>{},
    modalAdicionarMarca: <iModalCreate>{},

    dbCliente: <iCliente>{},
    clienteSelecionado: <iCliente>{},

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
                "Marca": { dataField: "DESCRICAO" }
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
            }),

            state.gridCliente = new xGridV2.create({
                el: "#gridCliente",
                height: 175,
                count: true,
                columns: {
                    "CNPJ": { dataField: "CGC_CLIENTE", width: "30%" },
                    "Cliente": { dataField: "NOME", compare: "colorir" },
                },
                compare: {
                    'colorir': (r) => {
                        if (r.QTD > 0)
                            return '<span style="color: blue">' + r.value + '<span>';
                        else
                            return r.value;
                    }
                },
                query: {
                    async execute(rs) {
                        let data = await actions.getClientes({
                            offset: rs.offset,
                            param: rs.param
                        })
                        state.gridCliente.querySourceAdd(data)
                    }
                },
                sideBySide: {
                    el: "#clienteCampos",
                    vModel(r) {
                        state.dbCliente = r
                    },
                    frame: {
                        el: "#btnClientes",
                        buttons: {
                            Cancel: {
                                html: "Cancelar",
                                state: "select",
                                click: actions.onClickCloseClienteModal,
                                preLoad: "Cancelando o cliente",
                            },
                            Ok: {
                                html: "OK",
                                state: "select",
                                click: actions.setarCliente,
                                preLoad: "Selecionando o cliente",
                            },
                        }
                    }
                },
                enter: actions.setarCliente,
                dblClick: actions.setarCliente
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

    onClickCloseClienteModal() {
        state.modalCliente.close()
    },

    onClickAdicionarMarcaModal() {
        state.modalAdicionarMarca.open()
    },

    searchClientes() {
        state.gridCliente.queryOpen({
            NOME: state.edtClienteSearch.value.toUpperCase(),
        });
    },

    setarCliente() {
        state.modalCliente.close()
        state.clienteSelecionado = {
            ID_CLIENTE: state.dbCliente.ID_CLIENTE,
            NOME: state.dbCliente.NOME,
            CGC_CLIENTE: state.dbCliente.CGC_CLIENTE,
            QTD: state.dbCliente.QTD
        }
    },

    async getClientes({ offset, param }: iParamGetClientes) {
        try {
            state.loading = true
            const data = await serviceDescontoCliente.getClientes({ offset, param });
            state.loading = false
            return data
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar os clientes!"
            })
        }
    },

}

export default { state, actions }