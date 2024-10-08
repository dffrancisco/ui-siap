import axios from "axios";
import {
    iGetClientesFaturadosParam, iGetClientesFaturadosResponse, iGetOrcamentosClienteFaturadoParam,
    iGetOrcamentosClienteFaturadoResponse,
    iGetRegrasFaturamentoResponse
} from "../interfaces";

const caminho = 'siap/faturarCliente'

type iGetClientesFaturadosFuction = (param: iGetClientesFaturadosParam, offset: number) =>
    Promise<iGetClientesFaturadosResponse>

type iGetOrcamentosClienteFaturadoFunction = (param: iGetOrcamentosClienteFaturadoParam) =>
    Promise<iGetOrcamentosClienteFaturadoResponse[]>
type iGetRegrasFaturamentoFunction = (idCliente: number, totalValorOrcamentos: number, dividirBoleto: 'S' | 'N')
    => Promise<iGetRegrasFaturamentoResponse>

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

const getRegrasFaturamento: iGetRegrasFaturamentoFunction = async (idCliente, totalValorOrcamentos, dividirBoleto) => {
    const { data } = await axios.post(caminho, {
        call: "getRegrasFaturamento",
        idCliente,
        totalValorOrcamentos,
        dividirBoleto
    });

    return data;
}

export default {
    getClientesFaturados,
    getOrcamentosClienteFaturado,
    getRegrasFaturamento
}