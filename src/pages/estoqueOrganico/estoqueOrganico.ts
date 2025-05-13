import Swal from "sweetalert2";
import serviceEstoqueOrganico from './services/estoqueOrganico.service';
import { reactive } from "vue";
import { iCarros, iMarcas, iParams } from "./interfaces";

export const state = reactive({
    loading: false,
    carros: <iCarros[]>[],
    carrosSelecionados: [],
    marcas: <iMarcas[]>[],
    marcasSelecionados: [],
    dadosEstoqueOrganico: <any[]>[],
    numFabricante: "",
    descricao: "",
    endEstoque: "",
    headers: <any>[]
})

export const actions = {
    async init() {
        actions.getDadosParaInputs()
    },

    async getDadosParaInputs() {
        try {
            state.loading = true;
            const data = await serviceEstoqueOrganico.getDadosParaInputs();
            state.marcas = data.marcas
            state.carros = data.carros


        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados iniciais!"
            });
        } finally {
            state.loading = false;
        }
    },

    async getDadosEstoqueOrganico() {
        try {
            state.loading = true;

            let param: iParams = {
                numFabricante: state.numFabricante,
                descricao: state.descricao,
                endEstoque: state.endEstoque,
                marcas: state.marcasSelecionados,
                carros: state.carrosSelecionados
            }

            const data = await serviceEstoqueOrganico.getDadosEstoqueOrganico(param);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados do estoque orgânico!"
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {

    },

    getClassCorLinha(dados: any) {
        const classe = dados.index % 2 === 0 ? "cor-zebrada-1" : "cor-zebrada-2";
        return { class: classe };
    },
}