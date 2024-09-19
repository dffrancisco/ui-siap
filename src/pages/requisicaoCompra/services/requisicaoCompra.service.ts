import axios from "axios";
import {
    iGetDuplicidadeRequisicaoCompraParam,
    iGetDuplicidadeRequisicaoCompraResponse,
    iGetFavorecidosParam,
    iGetFavorecidosResponse,
    iGetRequisicaoComprasParam,
    iGetRequisicaoComprasResponse,
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
type iGetRequisicaoComprasFunction = (param: iGetRequisicaoComprasParam, offset: number) =>
    Promise<iGetRequisicaoComprasResponse>

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

const getRequisicaoCompras: iGetRequisicaoComprasFunction = async (param, offset) => {
    let { data } = await axios.post(caminho, {
        call: "getRequisicaoCompras",
        offset,
        param
    })
    return data;
}

export default {
    getFavorecidos,
    insertRequisicaoCompra,
    getDuplicidadeRequisicaoCompra,
    getRequisicaoCompras
};