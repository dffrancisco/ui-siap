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
    inputElementDataFim: <HTMLInputElement>{},
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
            align: 'center'
        },
        {
            title: 'Crédito', key: 'CREDITO',
            align: 'center'
        },
        {
            title: 'Gerente', key: 'LOGIN',
            align: 'center'
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
        state.inputElementDataFim = <any>document.getElementById('DATA_FIM')
    },

    async buscarDevolucoes() {
        let dataInicio = state.dataInicio ? moment(state.dataInicio) : null
        let dataFim = state.dataFim ? moment(state.dataFim) : null

        if (!dataInicio || !dataFim) {
            Swal.fire({
                icon: 'warning',
                text: 'Por favor, insira uma data válida.',
            })
            return
        }

        if (dataInicio.isAfter(dataFim)) {
            Swal.fire({
                icon: 'warning',
                text: 'A data inicial deve ser menor que a data final.',
            })
            return;
        }

        await actions.getDevolucoes()
    },

    async getDevolucoes() {
        try {
            state.loading = true;

            let dataInicio = moment(state.dataInicio).format('YYYY-MM-DD');
            let dataFim = moment(state.dataFim).format('YYYY-MM-DD');

            const data = await serviceDevolucaodePecas.getDevolucoes({ dataInicio, dataFim })

            state.dbDevolucoes = data
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