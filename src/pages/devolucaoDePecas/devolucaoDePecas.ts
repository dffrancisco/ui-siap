import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceDevolucaodePecas from "./services/devolucaoDePecas.service";
import { iDevolucao } from "./interfaces";
import utils from "@/ts/utils";
import printJS from "print-js";

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
            align: 'center',
            value: (item: iDevolucao) => utils.dataBrasil(item.DATA)
        },
        {
            title: 'Valor', key: 'VALOR',
            align: 'center',
            value: (item: iDevolucao) => utils.formatValor(item.VALOR)
        },
        {
            title: 'NF-e', key: 'NF_DEVOLUCAO',
            align: 'center',
        },
        {
            title: 'Crédito', key: 'CREDITO',
            align: 'center',
            value: (item: iDevolucao) => utils.formatValor(item.CREDITO)
        },
        {
            title: 'Funcionário', key: 'LOGIN',
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
        state.inputElementDataFim = <HTMLInputElement>document.getElementById('DATA_FIM')
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? '' : 'cor-zebrada'
        return { class: classe }
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

    async btnPrint() {
        try {

            state.loading = true;

            let campos = state.headers.map((header) => ({
                field: header.key,
                displayName: header.title
            }))

            let dadosToPrint = state.dbDevolucoes.map((devolucao) => {
                return {
                    NUM_DEVOLUCAO: devolucao.NUM_DEVOLUCAO,
                    NUM_ORCAMENTO: devolucao.NUM_ORCAMENTO,
                    DATA: utils.dataBrasil(devolucao.DATA),
                    VALOR: utils.formatValor(devolucao.VALOR),
                    NF_DEVOLUCAO: devolucao.NF_DEVOLUCAO,
                    CREDITO: devolucao.CREDITO != null ? utils.formatValor(devolucao.CREDITO) : '',
                    LOGIN: devolucao.LOGIN,
                    STATUS: devolucao.STATUS,
                };
            });

            printJS({
                printable: dadosToPrint,
                properties: campos,
                documentTitle: `Devolução de Peças - Data: ${moment(state.dataInicio).format("DD/MM/YYYY")} até
              ${moment(state.dataFim).format("DD/MM/YYYY")}`,
                type: "json",
                gridHeaderStyle: "border: 1px solid #000000",
                gridStyle: "text-align: center; border: 1px solid #000000;",
            });

        } catch (error) {
            Swal.fire({
                text: "Erro ao imprimir as vendas!",
                icon: "error",
            });
        } finally {
            state.loading = false;
        }
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
                text: error?.response?.data?.msg || "Erro ao buscar as devoluções!"
            })
        } finally {
            state.loading = false;
        }
    }
}