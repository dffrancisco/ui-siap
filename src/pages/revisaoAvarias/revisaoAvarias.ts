import { reactive } from "vue";

export const selectRevisadaConteudo = [{
    value: "1",
    label: "Sim"
},
{
    value: "0",
    label: "Não"
}];

export const headersDataTable = [
    {
        title: "Nº Fabricante | Produto",
        key: "ASSUNTO",
        sortable: true,
    },
    {
        title: "Identificado por",
        key: "SOLICITANTE",
        sortable: true,
    },
    {
        title: "Revisada",
        key: "dataFormatada",
        sortable: true,
    },
    {
        title: "Destino",
        key: "ACAO",
        sortable: true,
    },
    {
        title: "Ações",
        key: "ACAO",
        sortable: false,
    }
]

export const state = reactive({

})