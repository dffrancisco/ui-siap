import { reactive } from "vue";
import $ from "jquery";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from '@/plugins/xModal/xModal';
import Swal from "sweetalert2";
import serviceDescontoCliente from "./services/descontoCliente.service"
import { iCliente, iMarca, iMarcaAdicionadaForm, iParamGetMarcas, iParamGetMarcasAdicionadas } from "./interfaces";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";

export const state = reactive({
    gridCliente: <ixGridCreate>{},
    gridMarca: <ixGridCreate>{},
    gridMarcaAdicionada: <ixGridCreate>{},

    edtMarcaSearch: <HTMLInputElement>{},

    modalCliente: <iModalCreate>{},
    modalAdicionarMarca: <iModalCreate>{},

    dbClienteSelecionado: <iCliente>{},
    dbMarca: <iMarca>{},

    loading: false,
    pnSearch: true,
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
                height: 221,
                width: 340,
                el: '#mdAdicionarMarca',
                theme: "xModal-blue",
            })
    },

    init() {
        $(".ss").attr("autocomplete", "off");

        state.edtMarcaSearch = <any>document.getElementById("edtMarcaSearch");

        actions.grids();
        actions.criarModais();
    },

    onClickClienteModal() {
        state.modalCliente.open()
    },

    onClickCloseClienteModal() {
        state.modalCliente.close()
    },

    onClickAdicionarMarcaModal() {
        const marca = state.gridMarca.dataSource()

        if (!marca) {
            Swal.fire({
                icon: "warning",
                title: "Selecione uma marca",
            });
            return;
        }

        state.dbMarca = marca

        state.modalAdicionarMarca.open()
    },

    onClickCloseAdicionarMarcaModal() {
        state.modalAdicionarMarca.close()
    },

    searchMarcas() {
        state.gridMarca.queryOpen({
            DESCRICAO: state.edtMarcaSearch.value.toUpperCase(),
        });
    },

    setarCliente(cliente: iCliente) {
        state.dbClienteSelecionado = {
            ...cliente
        }

        state.gridMarca.queryOpen({ DESCRICAO: "", ID_CLIENTE: state.dbClienteSelecionado.ID_CLIENTE }, () => {
            state.gridMarca.focus();
        });

        state.gridMarcaAdicionada.queryOpen({ ID_CLIENTE: state.dbClienteSelecionado.ID_CLIENTE }, () => {
            state.gridMarcaAdicionada.focus();
        });

        state.pnSearch = false;

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

    async adicionarMarca(marcaAdicionada: iMarcaAdicionadaForm) {
        try {
            const marca = state.gridMarca.dataSource()

            let idMarca = marca.ID_MARCA
            let idCliente = state.dbClienteSelecionado.ID_CLIENTE
            let descricao = marca.DESCRICAO
            let desconto = parseFloat(marcaAdicionada.DESCONTO.replace(',', '.')) * 10  

            if (desconto > 100) {
                desconto = 100 
            }
            
            let dadosMarcaAdicionada = {
                ID_MARCA: idMarca,
                ID_CLIENTE: idCliente,
                DESCONTO: desconto,
                DESCRICAO: descricao,
                DATA_INICIAL: marcaAdicionada.DATA_INICIAL,
                DATA_FINAL: marcaAdicionada.DATA_FINAL
            }

            state.loading = true
            const data = await serviceDescontoCliente.adicionarMarca(dadosMarcaAdicionada)
            state.loading = false

            state.modalAdicionarMarca.close()
            state.gridMarcaAdicionada.insertLine(dadosMarcaAdicionada)
            state.gridMarca.deleteLine()

            return data

        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao adicionar a marca!"
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

            if (await msgConfirm("Confirmação", "Confirma a exclusão desta marca?")) {
                state.loading = true
                const data = await serviceDescontoCliente.removerMarca(idMarca, idCliente)
                state.loading = false

                state.gridMarcaAdicionada.deleteLine();
                state.gridMarca.insertLine(marcaAdicionada);

                return data
            }

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