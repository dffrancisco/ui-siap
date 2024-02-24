import axios from "axios";
import {
    iDevolucaoSelecionadoResponse,
    iFornecedorSelecionadoResponse,
    iGetDevolucoesResponse,
    iGetFornecedoresResponse,
    iParamDevolucaoSelecionado,
    iParamFornecedorSelecionado,
    iParamGetDevolucoes,
    iParamGetFornecedores
} from "../interfaces";

const caminho = 'siap/devolucaoFornecedor'

type iGetDevolucoesFunction = (param: iParamGetDevolucoes) => Promise<iGetDevolucoesResponse>
type iDevolucaoSelecionadoFunction = (param: iParamDevolucaoSelecionado) => Promise<iDevolucaoSelecionadoResponse>
type iGetFornecedoresFunction = (param: iParamGetFornecedores) => Promise<iGetFornecedoresResponse>
type iFornecedorSelecionadoFunction = (param: iParamFornecedorSelecionado) => Promise<iFornecedorSelecionadoResponse>

const getDevolucoes: iGetDevolucoesFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getDevolucoes',
        offset,
        param
    })
    return data;
}

const devolucaoSelecionado: iDevolucaoSelecionadoFunction = async ({ id_devolucao }) => {
    let { data } = await axios.post(caminho, {
        call: 'devolucaoSelecionado',
        ID_DEVOLUCAO_FORNECEDOR: id_devolucao
    })
    return data;
}

const getFornecedores: iGetFornecedoresFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getFornecedores',
        offset,
        param
    })
    return data;
}

const fornecedorSelecionado: iFornecedorSelecionadoFunction = async ({ id_fornecedor }) => {
    let { data } = await axios.post(caminho, {
        call: 'fornecedorSelecionado',
        ID_FORNECEDOR: id_fornecedor
    })
    return data;
}

export default {
    getDevolucoes,
    getFornecedores,
    fornecedorSelecionado,
    devolucaoSelecionado
}