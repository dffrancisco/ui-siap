import { reactive } from "vue";
import { iFiltro, iAvariaDestino } from "./interfaces";
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
        key: "ASSUNTO",
        width: '30%',
        sortable: true,
    },
    {
        title: "Identificado por",
        key: "SOLICITANTE",
        width: '20%',
        align: 'left',
        sortable: true,
    },
    {
        title: "Revisada",
        key: "dataFormatada",
        width: '10%',
        align: 'center',
        sortable: true,
    },
    {
        title: "Destino",
        align: 'center',
        key: "ACAO",
        sortable: true,
    },
    {
        title: "Ações",
        width: "18%",
        align: 'center',
        key: "ACAO",
        sortable: false,
    }
]

export const state = reactive({
    loading: false,
    avariasDestinosLista: <iAvariaDestino[]>[],
    filtros: <iFiltro>{}
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
    }
}