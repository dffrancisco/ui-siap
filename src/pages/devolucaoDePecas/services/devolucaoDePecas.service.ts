import axios from "axios";
import { iGetDevolucoesResponse, iParamGetDevolucoes } from "../interfaces";

const caminho = 'taap/devolucaoDePecas'

type iGetDevolucoesFunction = ({ dataInicio, dataFim, tipoData }: iParamGetDevolucoes) => Promise<iGetDevolucoesResponse[]>

const getDevolucoes: iGetDevolucoesFunction = async ({ dataInicio, dataFim, tipoData }) => {
    let { data } = await axios.post(caminho, {
        call: 'getDevolucoes',
        dataInicio,
        dataFim,
        tipoData
    })
    return data;
}

export default {
    getDevolucoes
}
