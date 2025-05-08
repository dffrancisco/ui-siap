import moment from "moment";
import Swal from "sweetalert2";
import { reactive } from "vue";
import serviceRelatorioSeparacaoProdutos from "./services/relatorioSeparacaoProdutos.service"
import { iEstoquistas } from "./interfaces";

export const state = reactive({
    loading: false,
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    inputDataFinal: <HTMLInputElement>{},
    dataInicioImpressao: null,
    dataFimImpressao: null,
    estoquistas: <iEstoquistas[]>[],
    estoquistasSelecionados: [],
    dadosRelatorioSeparacaoProdutos: <any[]>[],
    headers: <any>[
        {
            title: "Funcionário",
            key: "LOGIN",
            sortable: true,
            align: 'left',
        },
        {
            title: "Quantidade",
            key: "QTD",
            sortable: true,
            align: 'left',
        }
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
}