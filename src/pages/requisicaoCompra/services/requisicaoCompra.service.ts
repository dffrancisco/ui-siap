import axios from "axios";
import {
    iDeleteRequisicaoComprasItemParam,
    iDeleteRequisicaoComprasItemResponse,
    iDeleteRequisicaoCompraParam,
    iDeleteRequisicaoCompraResponse,
    iFinalizarRequisicaoCompraParam,
    iFinalizarRequisicaoCompraResponse,
    iGetDadosToSelectProdutoResponse,
    iGetDuplicidadeRequisicaoCompraParam,
    iGetDuplicidadeRequisicaoCompraResponse,
    iGetFavorecidosParam,
    iGetFavorecidosResponse,
    iGetProdutosParam,
    iGetProdutosResponse,
    iGetRequisicaoCompraItensParam,
    iGetRequisicaoCompraItensResponse,
    iGetRequisicaoCompraParam,
    iGetRequisicaoCompraResponse,
    iGetRequisicoesComprasParam,
    iGetRequisicoesComprasResponse,
    iInsertOrUpdateItemParam,
    iInsertOrUpdateItemResponse,
    iInsertRequisicaoCompraParam,
    iInsertRequisicaoCompraResponse,
    iInsertItemNovoParam,
    iInsertItemNovoResponse,
    iUpdateItemNovoParam,
    iUpdateItemNovoResponse
} from "../interfaces";

const caminho = "taap/requisicaoCompra"

type iGetFavorecidosFunction = (param: iGetFavorecidosParam, offset: number) =>
    Promise<iGetFavorecidosResponse>
type iInsertRequisicaoCompraFunction = (param: iInsertRequisicaoCompraParam) =>
    Promise<iInsertRequisicaoCompraResponse>
type iGetDuplicidadeRequisicaoCompraFunction = (param: iGetDuplicidadeRequisicaoCompraParam) =>
    Promise<iGetDuplicidadeRequisicaoCompraResponse[]>
type iGetRequisicoesComprasFunction = (param: iGetRequisicoesComprasParam, offset: number) =>
    Promise<iGetRequisicoesComprasResponse>
type iGetRequisicaoCompraFunction = (param: iGetRequisicaoCompraParam) => Promise<iGetRequisicaoCompraResponse>
type iDeleteRequisicaoCompraFuncion = (param: iDeleteRequisicaoCompraParam) =>
    Promise<iDeleteRequisicaoCompraResponse>
type iFinalizarRequisicaoCompraFunction = (param: iFinalizarRequisicaoCompraParam) =>
    Promise<iFinalizarRequisicaoCompraResponse>
type iGetDadosToSelectProduto = () => Promise<iGetDadosToSelectProdutoResponse>
type iGetProdutosFunction = (param: iGetProdutosParam, offset: number) => Promise<iGetProdutosResponse>
type iInsertOrUpdateItemFunction = (param: iInsertOrUpdateItemParam) => Promise<iInsertOrUpdateItemResponse>
type iGetRequisicaoCompraItensFunction = (param: iGetRequisicaoCompraItensParam) =>
    Promise<iGetRequisicaoCompraItensResponse[]>
type iDeleteRequisicaoComprasItemFunction = (param: iDeleteRequisicaoComprasItemParam) =>
    Promise<iDeleteRequisicaoComprasItemResponse>
type iInsertItemNovoFunction = (param: iInsertItemNovoParam) => Promise<iInsertItemNovoResponse>
type iUpdateItemNovoFunction = (param: iUpdateItemNovoParam) => Promise<iUpdateItemNovoResponse>

const getFavorecidos: iGetFavorecidosFunction = async (param, offset) => {
    let { data } = await axios.post(caminho, {
        call: "getFavorecidos",
        offset,
        param
    })
    return data;
}

const insertRequisicaoCompra: iInsertRequisicaoCompraFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertRequisicaoCompra",
        param
    })
    return data;
}

const getDuplicidadeRequisicaoCompra: iGetDuplicidadeRequisicaoCompraFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicidadeRequisicaoCompra",
        param
    })
    return data;
}

const getRequisicoesCompras: iGetRequisicoesComprasFunction = async (param, offset) => {
    let { data } = await axios.post(caminho, {
        call: "getRequisicoesCompras",
        offset,
        param
    })
    return data;
}

const getRequisicaoCompra: iGetRequisicaoCompraFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getRequisicaoCompra",
        param
    })
    return data;
}

const deleteRequisicaoCompra: iDeleteRequisicaoCompraFuncion = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deleteRequisicaoCompra",
        param
    })
    return data;
}

const finalizarRequisicaoCompra: iFinalizarRequisicaoCompraFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "finalizarRequisicaoCompra",
        param
    })
    return data;
}

const getDadosToSelectProduto: iGetDadosToSelectProduto = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosToSelectProduto"
    })
    return data;
}

const getProdutos: iGetProdutosFunction = async (param, offset) => {
    let { data } = await axios.post(caminho, {
        call: "getProdutos",
        offset,
        param
    })
    return data;
}

const insertOrUpdateItem: iInsertOrUpdateItemFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertOrUpdateItem",
        param
    })
    return data;
}

const getRequisicaoComprasItensPorId: iGetRequisicaoCompraItensFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getRequisicaoComprasItensPorId",
        param
    })
    return data;
}

const deleteRequisicaoComprasItem: iDeleteRequisicaoComprasItemFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deleteRequisicaoComprasItem",
        param
    })
    return data;
}

const insertItemNovo: iInsertItemNovoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertItemNovo",
        param
    })
    return data;
}

const updateItemNovo: iUpdateItemNovoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "updateItemNovo",
        param
    })
    return data;
}

export default {
    getFavorecidos,
    insertRequisicaoCompra,
    getDuplicidadeRequisicaoCompra,
    getRequisicoesCompras,
    getRequisicaoCompra,
    deleteRequisicaoCompra,
    finalizarRequisicaoCompra,
    getDadosToSelectProduto,
    getProdutos,
    insertOrUpdateItem,
    getRequisicaoComprasItensPorId,
    deleteRequisicaoComprasItem,
    insertItemNovo,
    updateItemNovo,
};