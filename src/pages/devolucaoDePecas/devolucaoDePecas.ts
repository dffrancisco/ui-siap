import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceDevolucaodePecas from "./services/devolucaoDePecas.service";
import { iDevolucao } from "./interfaces";
import utils from "@/ts/utils";

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
            align: 'end',
        },
        {
            title: 'N° Orçamento', key: 'NUM_ORCAMENTO',
            align: 'end',

        },
        {
            title: 'Data Orçamento', key: 'DATA',
            align: 'center',
            value: (devolucao: iDevolucao) => utils.dataBrasil(devolucao.DATA)
        },
        {
            title: 'Valor Dev.', key: 'VALOR',
            align: 'end',
            value: (devolucao: iDevolucao) => utils.formatValor(devolucao.VALOR)
        },
        {
            title: 'Crédito', key: 'CREDITO',
            align: 'end',
            value: (devolucao: iDevolucao) => utils.formatValor(devolucao.CREDITO)
        },
        {
            title: 'Gerente', key: 'LOGIN',
            align: 'center'
        },
    ],
    pageTable: 1
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
            let page = state.pageTable - 1;

            const data = await serviceDevolucaodePecas.getDevolucoes({ dataInicio, dataFim, page })

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