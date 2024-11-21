import utils, { iColumnPrint } from "@/ts/utils";
import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceRelatorioEntregarReceber from './services/relatorioEntregarReceber.service'
import { iDadosRelatorioEntregarReceber } from "./interfaces";

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
    dadosRelatorio: <iDadosRelatorioEntregarReceber[]>[],
    headers: <any>[
        {
            title: "Nº Orçamento",
            key: "NUM_ORCAMENTO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Nome Cliente",
            key: "NOME_CLIENTE",
            sortable: true,
            align: 'left',
        },
        {
            title: "Data Venda",
            key: "DATA",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.dataBrasil(item.DATA),
        },
        {
            title: "Data Recebimento",
            key: "DATA_RECEBIMENTO",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.dataBrasil(item.DATA_RECEBIMENTO),
        },
        {
            title: "Funcionário",
            key: "LOGIN",
            sortable: true,
            align: 'center',
        },
        {
            title: "Tipo Pagamento",
            key: "DESCRICAO_PAGAMENTO",
            sortable: true,
            align: 'center',
        },
        {
            title: "Valor Recebido",
            key: "VALOR_RECEBIDO",
            sortable: true,
            align: 'center',
            value: (item: any) => utils.formatValor(item.VALOR_RECEBIDO),
        }
    ]
})


export const actions = {
    async init() {
        state.inputDataFinal = <any>document.getElementById('DATA_FIM')
        actions.validarInputs()
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

        const dataInicioMoment = moment(state.dataInicio);
        const dataFimMoment = moment(state.dataFim);
        const diferencaEmMeses = dataFimMoment.diff(dataInicioMoment, 'months');
        if (diferencaEmMeses > 6) {
            await Swal.fire({
                text: "O intervalo entre as datas não pode ser maior que 6 meses!",
                icon: "warning"
            });
            return;
        }

        actions.getDadosParaRelatorio();
    },

    getClassCorLinha(dados: any) {
        let classe = dados.index % 2 == 0 ? 'cor-zebrada-1' : 'cor-zebrada-2'
        return { class: classe }
    },

    updatePage(newPage: number) {
        state.page = newPage;
        actions.getDadosParaRelatorio();
    },

    async getDadosParaRelatorio() {
        try {
            state.loading = true;

            const data = await serviceRelatorioEntregarReceber.getDadosParaRelatorio({
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
            let relatorio = state.dadosRelatorio
            const relatorioFormatado = actions.formatarDadosImpressao([...relatorio])

            const columns: iColumnPrint[] = [
                { key: 'NUM_ORCAMENTO', label: 'Nº Orçamento', width: '15%', align: 'left' },
                { key: 'NOME_CLIENTE', label: 'Cliente', width: '15%', align: 'left' },
                { key: 'DATA', label: 'Data Venda', width: '20%', align: 'center' },
                { key: 'DATA_RECEBIMENTO', label: 'Data Recebimento', width: '20%', align: 'center' },
                { key: 'LOGIN', label: 'Funcionário', width: '17%', align: 'center' },
                { key: 'DESCRICAO_PAGAMENTO', label: 'Tipo Pagamento', width: '17%', align: 'center' },
                { key: 'VALOR_RECEBIDO', label: 'Valor Recebido', width: '15%', align: 'center' },
            ];

            const titulo = `
                <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
                    <span>Período: ${moment(state.dataInicioImpressao).format('DD/MM/YYYY')} até ${moment(state.dataFimImpressao).format('DD/MM/YYYY')}</span>
                    <strong style="font-size: 16px;">Relatório Entregar e Receber</strong>
                </div>
            `;

            await utils.printComCabecalho(columns, relatorioFormatado, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        } finally {
            state.loading = false;
        }
    },

    formatarDadosImpressao(data) {
        return data.map(item => ({
            ...item,
            DATA: item.DATA ? utils.dataBrasil(item.DATA) : '-----',
            DATA_RECEBIMENTO: item.DATA_RECEBIMENTO ? utils.dataBrasil(item.DATA_RECEBIMENTO) : '-----',
            VALOR_RECEBIDO: item.VALOR_RECEBIDO ? utils.formatValor(item.VALOR_RECEBIDO) : '-----',
        }));
    }

}