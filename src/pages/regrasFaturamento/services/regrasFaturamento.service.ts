import axios from "axios";
import {
    iDeleteRegraFaturamentoExclusivaResponse,
    iDeleteRegraFaturamentoParcelaResponse,
    iGetClientesFaturadosResponse,
    iGetFaturamentosExclusivosResponse,
    iGetRegraFaturamentoExclusivoResponse,
    iGetRegraFaturamentoParcelasResponse,
    iGetRegraFaturamentoResponse,
    iInsertRegraFaturamentoParcelaParam,
    iInsertRegraFaturamentoParcelaResponse,
    iUpdateOrInsertRegraFaturamentoParam,
    iUpdateOrInsertRegraFaturamentoResponse,
    iUpdateRegraFaturamentoParcelaParam,
    iUpdateRegraFaturamentoParcelaResponse
} from "../interfaces";

const caminho = 'taap/regrasFaturamento'

type getRegraFaturamentoFunction = () => Promise<iGetRegraFaturamentoResponse>
type updateOrInsertRegraFaturamentoFunction = (param: iUpdateOrInsertRegraFaturamentoParam) =>
    Promise<iUpdateOrInsertRegraFaturamentoResponse>
type iGetRegraFaturamentoParcelasFunction = () => Promise<iGetRegraFaturamentoParcelasResponse[]>
type iDeleteRegraFaturamentoParcelaFunction = (idRegraFaturamentoParcela: number) => Promise<iDeleteRegraFaturamentoParcelaResponse>
type iInsertRegraFaturamentoParcelaFunction = (param: iInsertRegraFaturamentoParcelaParam) =>
    Promise<iInsertRegraFaturamentoParcelaResponse>
type iUpdateRegraFaturamentoParcelaFunction = (param: iUpdateRegraFaturamentoParcelaParam) =>
    Promise<iUpdateRegraFaturamentoParcelaResponse>
type iGetFaturamentosExclusivosFunction = (offset: number, search: string) =>
    Promise<iGetFaturamentosExclusivosResponse>
type iGetClientesFaturadosFunction = (offset: number, search: string) =>
    Promise<iGetClientesFaturadosResponse>
type iGetRegraFaturamentoExclusivoFunction = (idCliente: number) =>
    Promise<iGetRegraFaturamentoExclusivoResponse>
type iDeleteRegraFaturamentoExclusivaFunction = (idCliente: number) =>
    Promise<iDeleteRegraFaturamentoExclusivaResponse>

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

const getFaturamentosExclusivos: iGetFaturamentosExclusivosFunction = async (offset, search) => {
    let { data } = await axios.post(caminho, {
        call: "getFaturamentosExclusivos",
        offset,
        search
    })

    return data;
}

const getClientesFaturados: iGetClientesFaturadosFunction = async (offset, search) => {
    let { data } = await axios.post(caminho, {
        call: "getClientesFaturados",
        offset,
        search
    })

    return data;
}

const getRegraFaturamentoExclusivo: iGetRegraFaturamentoExclusivoFunction = async (idCliente) => {
    let { data } = await axios.post(caminho, {
        call: "getRegraFaturamentoExclusivo",
        idCliente
    })

    return data;
}

const deleteRegraFaturamentoExclusiva: iDeleteRegraFaturamentoExclusivaFunction = async (idCliente) => {
    let { data } = await axios.post(caminho, {
        call: "deleteRegraFaturamentoExclusiva",
        idCliente
    })

    return data;
}

export default {
    getRegraFaturamento,
    updateOrInsertRegraFaturamento,
    getRegraFaturamentoParcelas,
    deleteRegraFaturamentoParcela,
    insertRegraFaturamentoParcela,
    updateRegraFaturamentoParcela,
    getFaturamentosExclusivos,
    getClientesFaturados,
    getRegraFaturamentoExclusivo,
    deleteRegraFaturamentoExclusiva,
}