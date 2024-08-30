import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { reactive } from "vue";
import { iClienteFaturado, iOrcamentosClienteFaturado } from "./interfaces";
import serviceFaturarCliente from "./services/faturarCliente.service";
import Swal from "sweetalert2";
import utils from "@/ts/utils";

export const state = reactive({
    gridPedido: <ixGridCreate>{},
    dataLimite: moment().format('YYYY-MM-DD'),
    modalSelecionarClienteOpened: false,
    dbClienteFaturado: <iClienteFaturado>{},
    loading: false,
    dbOrcamentosClienteFaturado: <iOrcamentosClienteFaturado[]>[],
})

export const actions = ({
    async init() {
        actions.criarGrid()
    },

    criarGrid() {
        state.gridPedido = new xGridV2.create({
            el: "#gridOrcamentosClienteFaturado",
            count: true,
            columns: {
                'Orç.': { dataField: 'NUM_ORCAMENTO', center: true, width: '10%' },
                'Nota Fiscal': { dataField: 'NUM_NFE', center: true, width: '10%' },
                'Cliente': { dataField: 'NOME', width: '35%' },
                'Data': { dataField: 'DATA', render: utils.dataBrasil, center: true },
                'Devolução': { dataField: 'DEVOLUCAO', render: utils.formatValor, right: true },
                'Valor': { dataField: 'VALOR', render: utils.formatValor, right: true }
            },
            query: {
                async execute(rs) {
                    const data = await actions.getOrcamentosClienteFaturado(rs.param)
                    state.gridPedido.querySourceAdd(data)
                    state.dbOrcamentosClienteFaturado = data
                }
            },
        })
    },

    closeModal() {
        state.modalSelecionarClienteOpened = false
    },

    selecionarCliente(cliente: iClienteFaturado) {
        state.dbClienteFaturado = cliente
        state.gridPedido.queryOpen({
            dataLimite: state.dataLimite,
            id_cliente: state.dbClienteFaturado.ID_CLIENTE
        })
    },

    async getOrcamentosClienteFaturado(param) {
        try {
            state.loading = true

            const data = await serviceFaturarCliente.getOrcamentosClienteFaturado(param)

            return data

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar os orçamentos do cliente!"
            })
        } finally {
            state.loading = false
        }
    }
})