import axios from "axios";
import { iGetDevolucoesResponse, iParamGetDevolucoes } from "../interfaces";

const caminho = 'siap/devolucaoDePecas'

type iGetDevolucoesFunction = ({ dataInicio, dataFim }: iParamGetDevolucoes) => Promise<iGetDevolucoesResponse[]>

const getDevolucoes: iGetDevolucoesFunction = async ({ dataInicio, dataFim }) => {
    let { data } = await axios.post(caminho, {
        call: 'getDevolucoes',
        dataInicio,
        dataFim,
    })
    return data;
}

export default {
    getDevolucoes
}
