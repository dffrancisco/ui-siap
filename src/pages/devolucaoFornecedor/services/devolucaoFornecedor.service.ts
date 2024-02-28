import axios from "axios";
import {
    iDevolucaoSelecionadoResponse,
    iFornecedorSelecionadoResponse,
    iGetDevolucoesResponse,
    iGetFornecedoresResponse,
    iGetItensResponse,
    iParamDevolucaoSelecionado,
    iParamFornecedorSelecionado,
    iParamGetDevolucoes,
    iParamGetFornecedores,
    iParamGetItens,
} from "../interfaces";

const caminho = 'siap/devolucaoFornecedor'

type iGetDevolucoesFunction = (param: iParamGetDevolucoes) => Promise<iGetDevolucoesResponse>
type iDevolucaoSelecionadoFunction = (param: iParamDevolucaoSelecionado) => Promise<iDevolucaoSelecionadoResponse>
type iGetFornecedoresFunction = (param: iParamGetFornecedores) => Promise<iGetFornecedoresResponse>
type iFornecedorSelecionadoFunction = (param: iParamFornecedorSelecionado) => Promise<iFornecedorSelecionadoResponse>
type iGetItensFunction = (param: iParamGetItens) => Promise<iGetItensResponse>

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
    await axios.post(caminho, {
        call: 'addNovaDevolucao',
        ID_FORNECEDOR: id_fornecedor
    })
}

const verificarSeExisteDevolucaoFornecedor = async (id_fornecedor: number) => {
    let { data } = await axios.post(caminho, {
        call: 'verificarSeExisteDevolucaoFornecedor',
        ID_FORNECEDOR: id_fornecedor
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
    verificarSeExisteDevolucaoFornecedor
}