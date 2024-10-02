import moment from "moment";
import { reactive } from "vue";
import { iDadosRelatorioProdutosVendidos } from "./interfaces";
import serviceRelatorioProdutosVendidos from './services/relatorioProdutosVendidos.service'
import Swal from "sweetalert2";

export const state = reactive({
    loading: false,
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    dataInicioImpressao: null,
    dataFimImpressao: null,
    totalItems: 0,
    itemsPerPage: 30,
    page: 1,
    dadosRelatorio: <iDadosRelatorioProdutosVendidos[]>[],
    headers: <any>[]
})

export const actions = {
    async init() {
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
            })
            return;
        }

        if (moment(state.dataInicio).isAfter(moment(state.dataFim))) {
            await Swal.fire({
                text: "Data inicial deve ser menor que a data final!",
                icon: "warning"
            });
            return false;
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

            console.log(data);
            state.dadosRelatorio = data.dadosRelatorio;
            state.totalItems = data.totalDadosRelatorio[0].TOTAL;

            state.dataInicioImpressao = state.dataInicio
            state.dataFimImpressao = state.dataFim
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao trazer os dados para relatório!"
            });
        } finally {
            state.loading = false;
        }
    }
}