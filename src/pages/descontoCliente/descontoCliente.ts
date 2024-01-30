import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from '@/plugins/xModal/xModal';
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";

import serviceDescontoCliente from "./services/descontoCliente.service"

import { iCliente, iMarca, iMarcaAdicionada, iParamGetMarcas, iParamGetMarcasAdicionadas } from "./interfaces";
import utils from "@/ts/utils";

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
            columns: {
                "Marca": { dataField: "DESCRICAO", width: "45%" },
                "Desconto %": { dataField: "DESCONTO", render: utils.formatValor, width: "16%", center: true },
                "Data Inicial": { dataField: "DATA_INICIAL", render: utils.dataBrasil, center: true },
                "Data Final": { dataField: "DATA_FINAL", render: utils.dataBrasil, center: true },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getMarcasAdicionadas({
                        offset: rs.offset,
                        param: rs.param
                    })
                    state.gridMarcaAdicionada.querySourceAdd(data)
                }
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
        state.dbClienteSelecionado = {
            ID_CLIENTE: cliente.ID_CLIENTE,
            NOME: cliente.NOME,
            CGC_CLIENTE: cliente.CGC_CLIENTE,
            QTD: cliente.QTD
        }

        state.gridMarca.queryOpen({ DESCRICAO: "", ID_CLIENTE: state.dbClienteSelecionado.ID_CLIENTE }, () => {
            state.gridMarca.focus();
        });

        state.gridMarcaAdicionada.queryOpen({ ID_CLIENTE: state.dbClienteSelecionado.ID_CLIENTE }, () => {
            state.gridMarcaAdicionada.focus();
        });

        state.modalCliente.close()
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
    },

    async getMarcasAdicionadas({ offset, param }: iParamGetMarcasAdicionadas) {
        try {

            state.loading = true
            const data = await serviceDescontoCliente.getMarcasAdicionadas({ offset, param });
            state.loading = false

            return data

        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar as marcas adicionadas!"
            })
        }
    },

    async removerMarca() {
        try {

            const marcaAdicionada = state.gridMarcaAdicionada.dataSource();

            if (!marcaAdicionada) {
                Swal.fire({
                    icon: "warning",
                    title: "Selecione uma marca",
                });
                return;
            }

            let idMarca = marcaAdicionada.ID_MARCA
            let idCliente = state.dbClienteSelecionado.ID_CLIENTE

            state.loading = true
            const data = await serviceDescontoCliente.removerMarca(idMarca, idCliente)
            state.loading = false

            state.gridMarcaAdicionada.deleteLine();
            state.gridMarca.insertLine(marcaAdicionada);

            return data
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao remover a marca!"
            })
        }
    }

}

export default { state, actions }