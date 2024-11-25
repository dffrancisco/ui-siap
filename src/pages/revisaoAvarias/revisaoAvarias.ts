import { reactive } from "vue";
import { iFiltro, iAvariaDestino, iAvaria } from "./interfaces";
import Swal from "sweetalert2";
import serviceRevisaoAvarias from "./services/serviceRevisaoAvarias.service";

export const revisadaConteudo = [{
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
        key: "NUM_FABRICANTE_PRODUTO",
        width: '30%',
        sortable: true,
    },
    {
        title: "Identificado por",
        key: "NOME_FUNCIONARIO_IDENTIFICOU",
        width: '20%',
        align: 'left',
        sortable: true,
    },
    {
        title: "Revisada",
        key: "FINALIZADO",
        width: '10%',
        align: 'center',
        sortable: true,
    },
    {
        title: "Destino",
        align: 'DESTINO',
        key: "ACAO",
        sortable: true,
    },
    {
        title: "Ações",
        width: "18%",
        align: 'center',
        sortable: false,
    }
]

export const state = reactive({
    loading: false,
    avariasDestinosLista: <iAvariaDestino[]>[],
    filtros: <iFiltro>{},
    dbAvarias: <iAvaria[]>[]
})

export const actions = {
    async init() {
        await actions.getAvariasDestinos()
    },

    async getAvariasDestinos() {
        try {
            state.loading = true
            state.avariasDestinosLista = await serviceRevisaoAvarias.getAvariasDestinos()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Ocorreu um erro ao buscar os destinos de avarias',
                text: error.message
            })
        } finally {
            state.loading = false
        }
    },

    async getAvarias() {
        try {
            state.loading = true
            state.dbAvarias = await serviceRevisaoAvarias.getAvarias(state.filtros)

            state.dbAvarias.map((avaria) => {
                avaria.NUM_FABRICANTE_PRODUTO = avaria.NUM_FABRICANTE + ' - ' + avaria.DESC_PRODUTO
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Ocorreu um erro ao buscar as avarias',
                text: error.message
            })
        } finally {
            state.loading = false
        }
    }
}