import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";
import { iOrcamentosClienteFaturado } from "./interfaces";

export const state = reactive({
    gridOrcamentosFaturados: <ixGridCreate>{},
    orcamentosFaturados: <iOrcamentosClienteFaturado>{},
    modalSelecionarClienteFaturadoOpened: false
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
                "N° Fiscal": { dataField: "NUM_NFE" },
                "N° Orçamento": { dataField: "NUM_ORCAMENTO" },
                "Data da Saida": { dataField: "DATA" },
                "Devolução": { dataField: "DEVOLUCAO" },
                "Desconto": { dataField: "DESCONTO" },
                "Valor Montagem": { dataField: "MONTAGEM" },
                "Valor Orçamento": { dataField: "VALOR" },
            },
        })
    }
}