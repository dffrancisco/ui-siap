import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";
import { iClienteFaturado, iGetOrcamentosClienteFaturadoParam, iOrcamentosClienteFaturado } from "./interfaces";
import serviceRelatorioFaturamento from "./services/relatorioFaturamento.service";
import moment from "moment";
import Swal from "sweetalert2";
import utils from "@/ts/utils";

export const state = reactive({
    gridOrcamentosFaturados: <ixGridCreate>{},
    clienteSelecionado: <iClienteFaturado>{},
    orcamentosFaturados: <iOrcamentosClienteFaturado>{},
    modalSelecionarClienteFaturadoOpened: false,
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    loading: false,
})

export const actions = {
    async init() {
        actions.createGrid()
    },

    async createGrid() {
        state.gridOrcamentosFaturados = new xGridV2.create({
            el: "#gridOrcamentosFaturados",
            height: 416,
            columns: {
                "N° Fiscal": { dataField: "NUM_NFE", center: true, width: '10%' },
                "N° Orçamento": { dataField: "NUM_ORCAMENTO", center: true, width: '10%' },
                "Data da Saida": { dataField: "DATA", center: true, width: '15%', render: utils.dataBrasil },
                "Devolução": { dataField: "DEVOLUCAO", right: true, width: '15%', render: utils.formatValor },
                "Desconto": { dataField: "DESCONTO", right: true, render: utils.formatValor },
                "Valor Montagem": { dataField: "MONTAGEM", right: true, render: utils.formatValor },
                "Valor Orçamento": { dataField: "VALOR", right: true, render: utils.formatValor },
            },
        })
    },

    async getOrcamentosFaturados(cliente: iClienteFaturado) {
        try {
            state.loading = true;

            state.clienteSelecionado = cliente;

            let param: iGetOrcamentosClienteFaturadoParam = {
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
                id_cliente: state.clienteSelecionado.ID_CLIENTE
            }

            const data = await serviceRelatorioFaturamento.getOrcamentosClienteFaturado(param)

            state.gridOrcamentosFaturados.source(data)

        } catch (erro) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar os orçamentos faturados."
            })
        } finally {
            state.loading = false
        }
    }
}