import axios from "axios";
import {
    iGetDevolucoesResponse,
    iGetFornecedoresResponse,
    iGetItensResponse,
    iInsertTransportadoraResponse,
    iParamGetDevolucoes,
    iParamGetFornecedores,
    iParamGetItens,
    iParamInsertTransportadoraDevolucao,
    iParamUpdateTransportadoraDevolucao,
    iUpdateTransportadoraResponse,
} from "../interfaces";

const caminho = 'siap/devolucaoFornecedor'

type iGetDevolucoesFunction = (param: iParamGetDevolucoes) => Promise<iGetDevolucoesResponse>
type iGetFornecedoresFunction = (param: iParamGetFornecedores) => Promise<iGetFornecedoresResponse>
type iGetItensFunction = (param: iParamGetItens) => Promise<iGetItensResponse>
type iInsertTransportadoraDevolucaoFunction = (param: iParamInsertTransportadoraDevolucao) => Promise<iInsertTransportadoraResponse>
type iUpdateTransportadoraDevolucaoFunction = (param: iParamUpdateTransportadoraDevolucao) => Promise<iUpdateTransportadoraResponse>

const getDevolucoes: iGetDevolucoesFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getDevolucoes',
        offset,
        param
    })
    return data;
}

const devolucaoSelecionado = async (id_devolucao: number) => {
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

const fornecedorSelecionado = async (id_fornecedor: number) => {
    let { data } = await axios.post(caminho, {
        call: 'fornecedorSelecionado',
        ID_FORNECEDOR: id_fornecedor
    })
    return data;
}

const getItens: iGetItensFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getItens',
        offset,
        param
    })
    return data;
}

const getTransportadoras = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getTransportadoras'
    })
    return data
}

const getTransportadoraDevolucao = async (id_devolucaoFornecedorTransp: number) => {
    let { data } = await axios.post(caminho, {
        call: 'getTransportadoraDevolucao',
        ID_DEVOLUCAO_FORNECEDOR_TRANSP: id_devolucaoFornecedorTransp
    })
    return data
}

const addNotaDevolucao = async (id_fornecedor: number) => {
    let { data } = await axios.post(caminho, {
        call: 'addNovaDevolucao',
        ID_FORNECEDOR: id_fornecedor
    })

    return data;
}

const verificarSeExisteDevolucaoFornecedor = async (id_fornecedor: number) => {
    let { data } = await axios.post(caminho, {
        call: 'verificarSeExisteDevolucaoFornecedor',
        ID_FORNECEDOR: id_fornecedor
    })
    return data
}

const insertTransportadoraDevolucao: iInsertTransportadoraDevolucaoFunction = async ({ param }) => {
    let { data } = await axios.post(caminho, {
        call: 'insertTransportadoraDevolucao',
        param
    })
    return data
}

const updateTransportadoraDevolucao: iUpdateTransportadoraDevolucaoFunction = async ({ param }) => {
    let { data } = await axios.post(caminho, {
        call: 'updateTransportadoraDevolucao',
        param
    })
    return data
}

export default {
    getDevolucoes,
    getFornecedores,
    fornecedorSelecionado,
    devolucaoSelecionado,
    getItens,
    getTransportadoras,
    getTransportadoraDevolucao,
    addNotaDevolucao,
    verificarSeExisteDevolucaoFornecedor,
    insertTransportadoraDevolucao,
    updateTransportadoraDevolucao
}