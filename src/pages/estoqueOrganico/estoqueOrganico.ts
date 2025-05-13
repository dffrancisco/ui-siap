import Swal from "sweetalert2";
import serviceEstoqueOrganico from './services/estoqueOrganico.service';
import { reactive } from "vue";
import { iCarros, iDadosEstoqueOrganico, iMarcas, iParams } from "./interfaces";

export const state = reactive({
    loading: false,
    carros: <iCarros[]>[],
    carrosSelecionados: [],
    marcas: <iMarcas[]>[],
    marcasSelecionados: [],
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    dadosEstoqueOrganico: <iDadosEstoqueOrganico[]>[],
    numFabricante: "",
    descricao: "",
    endEstoque: "",
    headers: <any>[
        {
            title: "Nº Fabricante",
            key: "NUM_FABRICANTE",
            sortable: true,
            align: 'left',
        },
        {
            title: "Produto",
            key: "DESC_PRODUTO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Carro",
            key: "CARRO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Marca",
            key: "MARCA",
            sortable: true,
            align: 'left',
        },
        {
            title: "End. Estoque",
            key: "END_ESTOQUE",
            sortable: true,
            align: 'left',
        },
        {
            title: "Quantidade",
            key: "QUANTIDADE",
            sortable: true,
            align: 'center',
        },
    ]
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
                page: state.page,
                itemsPerPage: state.itemsPerPage,
                numFabricante: state.numFabricante,
                descricao: state.descricao,
                endEstoque: state.endEstoque,
                marcas: state.marcasSelecionados,
                carros: state.carrosSelecionados
            }

            const data = await serviceEstoqueOrganico.getDadosEstoqueOrganico(param);
            state.dadosEstoqueOrganico = data.dadosEstoqueOrganico;
            state.totalItems = data.totalDadosRelatorio[0].TOTAL;

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados do estoque orgânico!"
            });
        } finally {
            state.loading = false;
        }
    },

    updatePage(newPage: number) {
        state.page = newPage;
        actions.getDadosEstoqueOrganico();
    },


    async onClickImprimir() {

    },

    getClassCorLinha(dados: any) {
        const classe = dados.index % 2 === 0 ? "cor-zebrada-1" : "cor-zebrada-2";
        return { class: classe };
    },
}