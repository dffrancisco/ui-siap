import moment from "moment";
import { reactive } from "vue";

export const state = reactive({
    loading: false,
    dataInicial: moment().format('YYYY-MM-DD'),
    dataFinal: moment().format('YYYY-MM-DD'),
    inputElementDataFinal: <HTMLInputElement>{},
})

export const dataHoje = moment().format('YYYY-MM-DD')

export const actions = {
    init() {
        state.inputElementDataFinal = <any>document.getElementById('DATA_FIM')
    }
}

export const computeds = {

}
