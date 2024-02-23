import axios from "axios";
import { iGetDevolucoesResponse, iParamGetDevolucoes } from "../interfaces";

const caminho = 'siap/devolucaoFornecedor'

type iGetDevolucoesFunction = (param: iParamGetDevolucoes) => Promise<iGetDevolucoesResponse>

const getDevolucoes: iGetDevolucoesFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getDevolucoes',
        offset,
        param
    })
    return data;
}

export default { getDevolucoes }