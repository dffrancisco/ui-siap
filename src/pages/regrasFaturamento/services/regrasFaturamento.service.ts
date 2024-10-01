import axios from "axios";
import { iDeleteRegraFaturamentoParcelaResponse, iGetRegraFaturamentoParcelasResponse, iGetRegraFaturamentoResponse, iInsertRegraFaturamentoParcelaParam, iInsertRegraFaturamentoParcelaResponse, iUpdateOrInsertRegraFaturamentoParam, iUpdateOrInsertRegraFaturamentoResponse, iUpdateRegraFaturamentoParcelaParam, iUpdateRegraFaturamentoParcelaResponse } from "../interfaces";

const caminho = 'siap/regrasFaturamento'

type getRegraFaturamentoFunction = () => Promise<iGetRegraFaturamentoResponse>
type updateOrInsertRegraFaturamentoFunction = (param: iUpdateOrInsertRegraFaturamentoParam) =>
    Promise<iUpdateOrInsertRegraFaturamentoResponse>
type iGetRegraFaturamentoParcelasFunction = () => Promise<iGetRegraFaturamentoParcelasResponse[]>
type iDeleteRegraFaturamentoParcelaFunction = (idRegraFaturamentoParcela: number) => Promise<iDeleteRegraFaturamentoParcelaResponse>
type iInsertRegraFaturamentoParcelaFunction = (param: iInsertRegraFaturamentoParcelaParam) =>
    Promise<iInsertRegraFaturamentoParcelaResponse>
type iUpdateRegraFaturamentoParcelaFunction = (param: iUpdateRegraFaturamentoParcelaParam) =>
    Promise<iUpdateRegraFaturamentoParcelaResponse>

const getRegraFaturamento: getRegraFaturamentoFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getRegraFaturamento"
    })

    return data
}

const updateOrInsertRegraFaturamento: updateOrInsertRegraFaturamentoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "updateOrInsertRegraFaturamento",
        param
    })

    return data;
}

const getRegraFaturamentoParcelas: iGetRegraFaturamentoParcelasFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getRegraFaturamentoParcelas"
    })

    return data;
}

const deleteRegraFaturamentoParcela: iDeleteRegraFaturamentoParcelaFunction = async (idRegraFaturamentoParcela) => {
    let { data } = await axios.post(caminho, {
        call: "deleteRegraFaturamentoParcela",
        idRegraFaturamentoParcela
    })

    return data;
}

const insertRegraFaturamentoParcela: iInsertRegraFaturamentoParcelaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertRegraFaturamentoParcela",
        param
    })

    return data;
}

const updateRegraFaturamentoParcela: iUpdateRegraFaturamentoParcelaFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "updateRegraFaturamentoParcela",
        param
    })

    return data;
}

export default {
    getRegraFaturamento,
    updateOrInsertRegraFaturamento,
    getRegraFaturamentoParcelas,
    deleteRegraFaturamentoParcela,
    insertRegraFaturamentoParcela,
    updateRegraFaturamentoParcela
}