import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceDevolucaodePecas from "./services/devolucaoDePecas.service";
import { iDevolucao } from "./interfaces";

export const dataHoje = moment().format('YYYY-MM-DD')

export const state = reactive({
    dataInicio: moment().format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    loading: false,
    dbDevolucoes: <iDevolucao[]>[],
    totalItens: 0,
    headers: <any>[
        {
            title: 'N° Devolução', key: 'NUM_DEVOLUCAO',
            align: 'center'
        },
        {
            title: 'N° Orçamento', key: 'NUM_ORCAMENTO',
            align: 'center'
        },
        {
            title: 'Data Orçamento', key: 'DATA',
            align: 'center'
        },
        {
            title: 'Valor Devolução', key: 'VALOR',
            align: 'end'
        },
        {
            title: 'Crédito', key: 'CREDITO',
            align: 'end'
        },
        {
            title: 'Gerente', key: 'LOGIN',
            align: 'start'
        },
        {
            title: 'Status', key: 'STATUS',
            align: 'center'
        },
    ],
})

export const actions = {
    async init() {
        actions.getDevolucoes()
    },

    async getDevolucoes() {
        try {
            state.loading = true;

            let dataInicio = moment(state.dataInicio).format('YYYY-MM-DD');
            let dataFim = moment(state.dataFim).format('YYYY-MM-DD');

            const data = await serviceDevolucaodePecas.getDevolucoes({ dataInicio, dataFim })

            state.dbDevolucoes = data
            state.totalItens = data.length
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar as devoluções!"
            })
        } finally {
            state.loading = false;
        }
    }
}