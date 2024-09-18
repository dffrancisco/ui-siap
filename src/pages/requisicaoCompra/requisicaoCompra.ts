import { reactive } from "vue";
import { iRequisicaoCompra } from "./interfaces";
import moment from "moment";

export const state = reactive({
    dbDadosRequisicao: <iRequisicaoCompra>{
        NOME_FAVORECIDO: 'ACM IND. E COM. DE PLASTICOS -21.880.230/0001-62',
        CNPJ_FAVORECIDO: '21.880.230/0001-62',
        DATA_HORA_CRIACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
        FINALIZADO: 'N'
    }
})