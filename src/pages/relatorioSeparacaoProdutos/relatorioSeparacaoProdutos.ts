import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceRelatorioSeparacaoProdutos from "./services/relatorioSeparacaoProdutos.service"
import { iEstoquistas, iRelatorioSeparacaoProdutos } from "./interfaces";
import utils, { iColumnPrint } from "@/ts/utils";

export const state = reactive({
    loading: false,
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    inputDataFinal: <HTMLInputElement>{},
    dataInicioImpressao: null,
    dataFimImpressao: null,
    estoquistas: <iEstoquistas[]>[],
    estoquistasSelecionados: [],
    dadosRelatorioSeparacaoProdutos: <iRelatorioSeparacaoProdutos[]>[],
    headers: <any>[
        {
            title: "Funcionário",
            key: "LOGIN_COM_CODIGO",
            sortable: true,
            align: 'left',
        },
        {
            title: "Quantidade Orçamentos",
            key: "TOTAL_ORCAMENTOS",
            sortable: true,
            align: 'center',
        },
        {
            title: "Quantidade Itens",
            key: "QTD",
            sortable: true,
            align: 'center',
        },
        {
            title: "Tempo Médio por Orçamento",
            key: "TEMPO_MEDIO_MINUTOS",
            sortable: true,
            align: 'center',
            value: (item: any) => `${item.TEMPO_MEDIO_MINUTOS}  minutos`
        },
        {
            title: "Última Separação",
            key: "ULTIMA_SEPARACAO",
            sortable: true,
            align: 'left',
            value: (item: any) => utils.dataBrasil(item.ULTIMA_SEPARACAO)
        },
    ]
});

export const actions = {
    async init() {
        await actions.getEstoquistas();
        state.inputDataFinal = <any>document.getElementById('dataFim')
        await actions.validarInputs();
    },

    async getEstoquistas() {
        state.loading = true;
        try {
            let data = await serviceRelatorioSeparacaoProdutos.getEstoquistas()
            state.estoquistas = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os estoquistas.",
            });
        } finally {
            state.loading = false;
        }
    },

    async validarInputs() {
        const { dataInicio, dataFim } = state;

        if (!dataInicio || !dataFim || moment(dataInicio).isAfter(moment(dataFim))) {
            await Swal.fire({
                text: !dataInicio || !dataFim
                    ? "Data Inválida!"
                    : "Data inicial deve ser menor que a data final!",
                icon: "warning"
            });
            return;
        }

        if (moment(dataFim).diff(moment(dataInicio), "months") > 3) {
            await Swal.fire({
                text: "O intervalo entre as datas não pode ser maior que 3 meses!",
                icon: "warning"
            });
            return;
        }

        actions.getDadosRelatorioSeparacaoProdutos();
    },

    async getDadosRelatorioSeparacaoProdutos() {
        state.loading = true;
        try {

            let param = {
                dataInicio: state.dataInicio,
                dataFim: state.dataFim,
                estoquistas: state.estoquistasSelecionados
            }

            let data = await serviceRelatorioSeparacaoProdutos.getDadosRelatorioSeparacaoProdutos(param)

            state.dataInicioImpressao = state.dataInicio
            state.dataFimImpressao = state.dataFim

            state.dadosRelatorioSeparacaoProdutos = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.msg || "Erro ao trazer os dados para relatório!"
            });
        } finally {
            state.loading = false;
        }
    },

    getClassCorLinha(dados: any) {
        const classe = dados.index % 2 === 0 ? "cor-zebrada-1" : "cor-zebrada-2";
        return { class: classe };
    },

    async onClickImprimir() {
        try {
            state.loading = true;

            const dadosRelatorioSeparacaoProdutos = actions.formatarDadosImpressao([...state.dadosRelatorioSeparacaoProdutos]);


            const columns: iColumnPrint[] = [
                { key: 'LOGIN_COM_CODIGO', label: 'Estoquista', width: '35%', align: 'left' },
                { key: 'TOTAL_ORCAMENTOS', label: 'Qtd Orçamentos', width: '15%', align: 'center' },
                { key: 'QTD', label: 'Qtd. Itens', width: '17%', align: 'center' },
                { key: 'TEMPO_MEDIO_MINUTOS', label: 'Tempo médio por orçamento', width: '17%', align: 'center' },
                { key: 'ULTIMA_SEPARACAO', label: 'Última separação', width: '16%', align: 'center' }
            ];

            const titulo = `
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px">
                        <span>Período: ${moment(state.dataInicioImpressao).format('DD/MM/YYYY')} até ${moment(state.dataFimImpressao).format('DD/MM/YYYY')}</span>
                        <strong style="font-size: 16px;">Relatório Separação de Produtos</strong>
                    </div>
                `;

            await utils.printComCabecalho(columns, dadosRelatorioSeparacaoProdutos, titulo);

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao imprimir o relatório."
            });
        } finally {
            state.loading = false;
        }
    },

    formatarDadosImpressao(data: iRelatorioSeparacaoProdutos[]) {
        return data.map(item => ({
            ...item,
            TEMPO_MEDIO_MINUTOS: `${item.TEMPO_MEDIO_MINUTOS} minutos`,
            ULTIMA_SEPARACAO: utils.dataBrasil(item.ULTIMA_SEPARACAO)
        }))
    },
}