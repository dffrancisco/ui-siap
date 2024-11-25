import { reactive } from "vue";
import { iFiltro, iTipoDestino } from "./interfaces";
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
    tiposDestinosLista: <iTipoDestino[]>[],
    filtros: <iFiltro>{}
})

export const actions = {
    async init() {
        await actions.getTiposDestinos()
    },

    async getTiposDestinos() {
        try {
            state.loading = true
            state.tiposDestinosLista = await serviceRevisaoAvarias.getTiposDestinos()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Ocorreu um erro ao buscar os tipos de destino',
                text: error.message
            })
        } finally {
            state.loading = false
        }
    }
}