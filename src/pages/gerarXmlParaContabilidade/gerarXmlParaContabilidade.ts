import moment from "moment";
import { reactive } from "vue";
import { mesesToSelect } from "@/constants/constants";

const ano = moment().year();
const mes = moment().month() + 1;
export const meses = mesesToSelect;

export const state = reactive({
    optionSelect: "0", // Padrão: Data Início - Data Fim
    loading: false,
    dataInicio: moment().startOf("month").format("YYYY-MM-DD"),
    dataFim: moment().format("YYYY-MM-DD"),
    mes: mes,
    ano: ano || "",
});

export const actions = {
    async init() {
        // Inicialização de estados ou lógica adicional
    },
};
