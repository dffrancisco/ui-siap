import axios from "axios";
import {
    iDeleteRequisicaoCompraParam,
    iDeleteRequisicaoCompraResponse,
    iGetDuplicidadeRequisicaoCompraParam,
    iGetDuplicidadeRequisicaoCompraResponse,
    iGetFavorecidosParam,
    iGetFavorecidosResponse,
    iGetRequisicaoCompraParam,
    iGetRequisicaoCompraResponse,
    iGetRequisicoesComprasParam,
    iGetRequisicoesComprasResponse,
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
type iDeleteRequisicaoCompraFuncion = (param: iDeleteRequisicaoCompraParam) => Promise<iDeleteRequisicaoCompraResponse>

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

export default {
    getFavorecidos,
    insertRequisicaoCompra,
    getDuplicidadeRequisicaoCompra,
    getRequisicoesCompras,
    getRequisicaoCompra,
    deleteRequisicaoCompra
};