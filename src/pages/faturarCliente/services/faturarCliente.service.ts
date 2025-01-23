import axios from "axios";
import {
    iGerarBoletosParam,
    iGerarBoletosResponse,
    iGerRegrasFaturamentoExclusivoResponse,
    iGetClientesFaturadosParam,
    iGetClientesFaturadosResponse,
    iGetCreditosClienteParam,
    iGetCreditosClienteResponse,
    iGetOrcamentosClienteFaturadoParam,
    iGetOrcamentosClienteFaturadoResponse,
    iGetRegrasFaturamentoGeralResponse
} from "../interfaces";

const caminho = 'siap/faturarCliente'

type iGetClientesFaturadosFuction = (param: iGetClientesFaturadosParam, offset: number) => Promise<iGetClientesFaturadosResponse>
type iGetOrcamentosClienteFaturadoFunction = (param: iGetOrcamentosClienteFaturadoParam) => Promise<iGetOrcamentosClienteFaturadoResponse[]>
type iGetCreditosClienteFunction = (param: iGetCreditosClienteParam) => Promise<iGetCreditosClienteResponse[]>
type iGetRegrasFaturamentoGeralFunction = () => Promise<iGetRegrasFaturamentoGeralResponse>
type iGerarBoletosFunction = (param: iGerarBoletosParam) => Promise<iGerarBoletosResponse>
type iGerRegrasFaturamentoExclusivoFunction = (idCliente: number) => Promise<iGerRegrasFaturamentoExclusivoResponse[]>

const getClientesFaturados: iGetClientesFaturadosFuction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getClientesFaturados",
        offset,
        param
    });

    return data;
}

const getOrcamentosClienteFaturado: iGetOrcamentosClienteFaturadoFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getOrcamentosClienteFaturado",
        param
    });

    return data;
}

const getCreditosCliente: iGetCreditosClienteFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getCreditosCliente",
        param
    });

    return data;
}

const getRegrasFaturamentoGeral: iGetRegrasFaturamentoGeralFunction = async () => {
    const { data } = await axios.post(caminho, {
        call: "getRegrasFaturamentoGeral"
    });

    return data;
}

const gerarBoletos: iGerarBoletosFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "gerarBoletos",
        param
    })

    return data;
}

const getRegrasFaturamentoExclusivo: iGerRegrasFaturamentoExclusivoFunction = async (idCliente) => {
    const { data } = await axios.post(caminho, {
        call: "getRegrasFaturamentoExclusivo",
        idCliente
    })

    return data;
}

export default {
    getClientesFaturados,
    getOrcamentosClienteFaturado,
    getCreditosCliente,
    getRegrasFaturamentoGeral,
    gerarBoletos,
    getRegrasFaturamentoExclusivo
}