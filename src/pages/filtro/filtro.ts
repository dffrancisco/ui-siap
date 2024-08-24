import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceFiltro from './services/filtro.service';
import { iCarros, iFiltros, iFuncionario, iMarcas } from "./interfaces";


export const state = reactive({
    loading: false,
    totalItems: 0,
    itemsPerPage: 30,
    carros: <iCarros[]>[],
    marcas: <iMarcas[]>[],
    funcionarios: <iFuncionario[]>[],
    filtros: <iFiltros[]>[],
})

export const actions = {
    async init() {
        actions.validarInputs()
    },

    validarInputs() {
        console.log('init');
        actions.getDadosParaFiltros()
    },

    async getDadosParaFiltros() {
        try {
            state.loading = true;
            const carros = await serviceFiltro.getCarros()
            const marcas = await serviceFiltro.getMarcas()
            const funcionarios = await serviceFiltro.getFuncionarios()
            const filtros = await serviceFiltro.getFiltros()

            state.carros = carros
            state.marcas = marcas
            state.funcionarios = funcionarios
            state.filtros = filtros

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir as trazer os dados!"
            });
        } finally {
            state.loading = false;
        }
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    async onClickImprimir() {
        console.log('imprimir');
    }

}