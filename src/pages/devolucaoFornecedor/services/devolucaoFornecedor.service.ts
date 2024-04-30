import axios from "axios";
import {
    iBaixarNFeEntradaGetTributosItemNotaResponse,
    iEmitirNotaDevolucaoFornecedorPreviaResponse,
    iFinalizarDevolucaoResponse,
    iGetDevolucoesResponse,
    iGetFornecedoresResponse,
    iGetItensDevolucaoQTDResponse,
    iGetItensResponse,
    iGetTributosItemNotaResponse,
    iInsertTransportadoraResponse,
    iParamBaixarNFeEntradaGetTributosItemNota,
    iParamEmitirNotaDevolucaoFornecedorPrevia,
    iParamFinalizarDevolucao,
    iParamGetDevolucoes,
    iParamGetFornecedores,
    iParamGetItens,
    iParamGetItensDevolucaoQTDFunction,
    iParamGetTributosItemNota,
    iParamInsertTransportadoraDevolucao,
    iParamUpdateInsertItemDevolucao,
    iParamUpdateTransportadoraDevolucao,
    iUpdateInsertItemDevolucaoResponse,
    iUpdateTransportadoraResponse,
} from "../interfaces";

const caminho = 'siap/devolucaoFornecedor'

type iGetDevolucoesFunction = (param: iParamGetDevolucoes) => Promise<iGetDevolucoesResponse>
type iGetFornecedoresFunction = (param: iParamGetFornecedores) => Promise<iGetFornecedoresResponse>
type iGetItensFunction = (param: iParamGetItens) => Promise<iGetItensResponse>
type iInsertTransportadoraDevolucaoFunction = (param: iParamInsertTransportadoraDevolucao) =>
    Promise<iInsertTransportadoraResponse>
type iUpdateTransportadoraDevolucaoFunction = (param: iParamUpdateTransportadoraDevolucao) =>
    Promise<iUpdateTransportadoraResponse>
type iUpdateInsertItemDevolucaoFunction = (param: iParamUpdateInsertItemDevolucao) =>
    Promise<iUpdateInsertItemDevolucaoResponse>
type iFinalizarDevolucaoFunction = (param: iParamFinalizarDevolucao) => Promise<iFinalizarDevolucaoResponse>
type iGetTributosItemNotaFunction = (param: iParamGetTributosItemNota) =>
    Promise<iGetTributosItemNotaResponse>
type iGetItensDevolucaoQTDFunction = (param: iParamGetItensDevolucaoQTDFunction) =>
    Promise<iGetItensDevolucaoQTDResponse>
type iEmitirNotaDevolucaoFornecedorPreviaFunction = (param: iParamEmitirNotaDevolucaoFornecedorPrevia) =>
    Promise<iEmitirNotaDevolucaoFornecedorPreviaResponse>
type iBaixarNFeEntradaGetTributosItemNotaFunction = (param: iParamBaixarNFeEntradaGetTributosItemNota) =>
    Promise<iBaixarNFeEntradaGetTributosItemNotaResponse>

const getDevolucoes: iGetDevolucoesFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getDevolucoes',
        offset,
        param
    })
    return data;
}

const getDevolucao = async (id_devolucao: number) => {
    let { data } = await axios.post(caminho, {
        call: 'getDevolucao',
        ID_DEVOLUCAO_FORNECEDOR: id_devolucao
    })
    return data;
}

const getItensDevolucao = async (id_devolucao: number) => {
    let { data } = await axios.post(caminho, {
        call: 'getItensDevolucao',
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

const insertTransportadoraDevolucao: iInsertTransportadoraDevolucaoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'insertTransportadoraDevolucao',
        param
    })
    return data
}

const updateTransportadoraDevolucao: iUpdateTransportadoraDevolucaoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'updateTransportadoraDevolucao',
        param
    })
    return data
}

const deleteItemDevolucao = async (id_devolucaoFornecedorItem: number) => {
    await axios.post(caminho, {
        call: 'deleteItemDevolucao',
        ID_DEVOLUCAO_FORNECEDOR_ITEM: id_devolucaoFornecedorItem
    })
}

const updateInsertItemDevolucao: iUpdateInsertItemDevolucaoFunction = async ({ param }) => {
    let { data } = await axios.post(caminho, {
        call: 'updateInsertItemDevolucao',
        param
    })
    return data
}

const deleteDevolucao = async (id_devolucao: number) => {
    let { data } = await axios.post(caminho, {
        call: 'deleteDevolucao',
        ID_DEVOLUCAO_FORNECEDOR: id_devolucao
    })

    return data
}

const finalizarDevolucao: iFinalizarDevolucaoFunction = async ({ param }) => {
    let { data } = await axios.post(caminho, {
        call: 'finalizarDevolucao',
        param
    })
    return data
}

const emitirNotaDevolucaoFornecedorPrevia: iEmitirNotaDevolucaoFornecedorPreviaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'emitirNotaDevolucaoFornecedor',
        param
    })
    return data
}

const getTributosItemNota: iGetTributosItemNotaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'getTributosItemNota',
        param
    })
    return data
}

const getItensDevolucaoQTD: iGetItensDevolucaoQTDFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'getItensDevolucaoQTD',
        param
    })
    return data
}

const baixarNFeEntradaGetTributosItemNota: iBaixarNFeEntradaGetTributosItemNotaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'baixarNFeEntradaGetTributosItemNota',
        param
    })
    return data
}

export default {
    getDevolucoes,
    getFornecedores,
    getDevolucao,
    getItensDevolucao,
    getItens,
    getTransportadoras,
    getTransportadoraDevolucao,
    addNotaDevolucao,
    verificarSeExisteDevolucaoFornecedor,
    insertTransportadoraDevolucao,
    updateTransportadoraDevolucao,
    deleteItemDevolucao,
    updateInsertItemDevolucao,
    deleteDevolucao,
    finalizarDevolucao,
    emitirNotaDevolucaoFornecedorPrevia,
    getTributosItemNota,
    getItensDevolucaoQTD,
    baixarNFeEntradaGetTributosItemNota
}