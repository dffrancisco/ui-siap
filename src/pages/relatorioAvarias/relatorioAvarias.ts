import moment from "moment";
import { reactive } from "vue";

export const state = reactive({
    loading: false,
    dataInicio: moment().startOf('month').format('YYYY-MM-DD'),
    dataFim: moment().format('YYYY-MM-DD'),
    inputDataFinal: <HTMLInputElement>{},
    dataInicioImpressao: null,
    dataFimImpressao: null,
})

export const actions = {
    async init() {
        actions.getMarcas();
        state.inputDataFinal = <any>document.getElementById('DATA_FIM')
    },

    async getMarcas() {
        state.loading = true;
        try {
            const response = await fetch('http://localhost:3000/marcas');
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
        state.loading = false;
    }
}