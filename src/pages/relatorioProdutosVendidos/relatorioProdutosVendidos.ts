import moment from "moment";
import { reactive } from "vue";
import { iDadosRelatorioProdutosVendidos } from "./interfaces";
import serviceRelatorioProdutosVendidos from './services/relatorioProdutosVendidos.service'
import Swal from "sweetalert2";
import utils, { iColumnPrint } from "@/ts/utils";

export const state = reactive({
    loading: false,
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    inputDataFinal: <HTMLInputElement>{},
    dataInicioImpressao: null,
    dataFimImpressao: null,
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    dadosRelatorio: <iDadosRelatorioProdutosVendidos[]>[],
    headers: <any>[
        {
            title: "Produto",
            key: "DESC_PRODUTO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Nº Fabricante",
            key: "NUM_FABRICANTE",
            sortable: true,
            align: 'left',
        },
        {
            title: "Qtd Estoque",
            key: "QTO_ESTOQUE",
            sortable: true,
            align: 'right',
        },
        {
            title: "Qtd Vendas",
            key: "QTO_VENDA",
            sortable: true,
            align: 'right',
        },
        {
            title: "End. Estoque",
            key: "END_ESTOQUE",
            sortable: true,
            align: 'left',
        }
    ]
})

export const actions = {
    async init() {
        state.inputDataFinal = <any>document.getElementById('DATA_FIM')
        actions.validarInputs()
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    updatePage(newPage: number) {
        state.page = newPage;
        actions.getDadosParaRelatorio();
    },

    async validarInputs() {
        if (!state.dataInicio || !state.dataFim) {
            await Swal.fire({
                text: "Data Inválida!",
                icon: "warning"
            });
            return;
        }

        if (moment(state.dataInicio).isAfter(moment(state.dataFim))) {
            await Swal.fire({
                text: "Data inicial deve ser menor que a data final!",
                icon: "warning"
            });
            return;
        }

        //converter para poder comparar
        const dataInicioMoment = moment(state.dataInicio);
        const dataFimMoment = moment(state.dataFim);
        const diferencaEmMeses = dataFimMoment.diff(dataInicioMoment, 'months');
        if (diferencaEmMeses > 3) {
            await Swal.fire({
                text: "O intervalo entre as datas não pode ser maior que 3 meses!",
                icon: "warning"
            });
            return;
        }

        actions.getDadosParaRelatorio();
    },


    async getDadosParaRelatorio() {
        try {
            state.loading = true;

            const data = await serviceRelatorioProdutosVendidos.getDadosParaRelatorio({
                page: state.page,
                itemsPerPage: state.itemsPerPage,
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
            });
            state.dadosRelatorio = data.dadosRelatorio;
            state.totalItems = data.totalDadosRelatorio[0].TOTAL;

            state.dataInicioImpressao = state.dataInicio
            state.dataFimImpressao = state.dataFim
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.msg || "Erro ao trazer os dados para relatório!"
            });
        } finally {
            state.loading = false;
        }
    },

    async onClickImprimir() {
        try {
            state.loading = true;

            const columns: iColumnPrint[] = [
                { key: 'DESC_PRODUTO', label: 'Produto', width: '35%', align: 'left' },
                { key: 'NUM_FABRICANTE', label: 'Nº Fabricante', width: '15%', align: 'left' },
                { key: 'QTO_ESTOQUE', label: 'Qtd. Estoque', width: '17%', align: 'center' },
                { key: 'QTO_VENDA', label: 'Qtd. Venda', width: '17%', align: 'center' },
                { key: 'END_ESTOQUE', label: 'End. Estoque', width: '16%', align: 'left' }
            ];

            const titulo = `
                <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
                    <span>Período: ${moment(state.dataInicioImpressao).format('DD/MM/YYYY')} até ${moment(state.dataFimImpressao).format('DD/MM/YYYY')}</span>
                    <strong style="font-size: 16px;">Relatório Produtos Vendidos</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, state.dadosRelatorio, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        } finally {
            state.loading = false;
        }
    }
}