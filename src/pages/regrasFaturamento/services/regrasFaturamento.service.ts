import axios from "axios";
import { iDeleteRegraFaturamentoParcelaResponse, iGetRegraFaturamentoParcelasResponse, iGetRegraFaturamentoResponse, iUpdateOrInsertRegraFaturamentoParam, iUpdateOrInsertRegraFaturamentoResponse } from "../interfaces";

const caminho = 'siap/regrasFaturamento'

type getRegraFaturamentoFunction = () => Promise<iGetRegraFaturamentoResponse>
type updateOrInsertRegraFaturamentoFunction = (param: iUpdateOrInsertRegraFaturamentoParam) =>
    Promise<iUpdateOrInsertRegraFaturamentoResponse>
type iGetRegraFaturamentoParcelasFunction = () => Promise<iGetRegraFaturamentoParcelasResponse[]>
type iDeleteRegraFaturamentoParcelaFunction = (idRegraFaturamentoParcela: number) => Promise<iDeleteRegraFaturamentoParcelaResponse>

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

export default {
    getRegraFaturamento,
    updateOrInsertRegraFaturamento,
    getRegraFaturamentoParcelas,
    deleteRegraFaturamentoParcela,
}