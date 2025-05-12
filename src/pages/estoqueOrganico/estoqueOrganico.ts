import { reactive } from "vue";

export const state = reactive({
    loading: false,
    carros: <any[]>[],
    carrosSelecionados: [],
    marcas: <any[]>[],
    marcasSelecionados: [],
    dadosEstoqueOrganico: <any[]>[],
    numFabricante: "",
    descricao: "",
    headers: <any>[]
})

export const actions = {
    async init() {

    },

    validarInputs() {

    },

    async onClickImprimir() {

    },

    getClassCorLinha(dados: any) {
        const classe = dados.index % 2 === 0 ? "cor-zebrada-1" : "cor-zebrada-2";
        return { class: classe };
    },
}