import axios from "axios";
import { iGetValesAPagarResponse, iGetValesPagosResponse, iGetValorDisponivelValeResponse, iParamAlterarValeRequest, iParamNegarValeRequest, iParamPagarValeRequest } from "../interface";

const caminho = 'siap/valeDinheiro'

type iGetValesAPagarFunction = () => Promise<iGetValesAPagarResponse>
type iGetValesPagosFunction = () => Promise<iGetValesPagosResponse>
type iGetValorDisponivelValeFunction = () => Promise<iGetValorDisponivelValeResponse>
type iNegarValeFunction = (param: iParamNegarValeRequest) => Promise<void>
type iAlterarValeFunction = (param: iParamAlterarValeRequest) => Promise<void>
type iPagarValeFunction = (param: iParamPagarValeRequest) => Promise<void>

const getValesAPagar: iGetValesAPagarFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getValesAPagar',
    });

    return data;
}

const getValesPagos: iGetValesPagosFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getValesPagos',
    });

    return data;
}

const getValorDisponivelVale: iGetValorDisponivelValeFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getValorDisponivelVale',
    });

    return data;
}

const negarVale: iNegarValeFunction = async (param) => {
    return await axios.post(caminho, {
        call: 'negarVale',
        param: {
            COD_FUNCIONARIO: param.COD_FUNCIONARIO,
            DATA: param.DATA
        }
    });
}

const alterarVale: iAlterarValeFunction = async (param) => {
    return await axios.post(caminho, {
        call: 'alterarVale',
        param: {
            COD_FUNCIONARIO: param.COD_FUNCIONARIO,
            DATA: param.DATA,
            VALOR: param.VALOR
        }
    });
}

const pagarVale: iPagarValeFunction = async (param) => {
    return await axios.post(caminho, {
        call: 'pagarVale',
        param: {
            funcionarios: param.funcionarios,
            COD_FUNCIONARIO_PAGADOR: param.COD_FUNCIONARIO_PAGADOR,
        }
    });
}

export default {
    getValesAPagar,
    getValesPagos,
    getValorDisponivelVale,
    negarVale,
    alterarVale,
    pagarVale,
}