import axios from "axios";
import {
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
    iGetRequisicaoCompraParam,
    iGetRequisicaoCompraResponse,
    iGetRequisicoesComprasParam,
    iGetRequisicoesComprasResponse,
    iInsertProdutoParam,
    iInsertProdutoResponse,
    iInsertRequisicaoCompraParam,
    iInsertRequisicaoCompraResponse
} from "../interfaces";

const caminho = "siap/requisicaoCompra"

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
type iInsertProdutoFunction = (param: iInsertProdutoParam) => Promise<iInsertProdutoResponse>

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

const insertProduto: iInsertProdutoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertProduto",
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
    insertProduto,
};