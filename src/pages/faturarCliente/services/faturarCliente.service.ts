import axios from "axios";
import {
    iGerarBoletosParam,
    iGerarBoletosResponse,
    iGetClientesFaturadosParam,
    iGetClientesFaturadosResponse,
    iGetOrcamentosClienteFaturadoParam,
    iGetOrcamentosClienteFaturadoResponse,
    iGetRegrasFaturamentoGeralResponse
} from "../interfaces";

const caminho = 'siap/faturarCliente'

type iGetClientesFaturadosFuction = (param: iGetClientesFaturadosParam, offset: number) =>
    Promise<iGetClientesFaturadosResponse>
type iGetOrcamentosClienteFaturadoFunction = (param: iGetOrcamentosClienteFaturadoParam) =>
    Promise<iGetOrcamentosClienteFaturadoResponse[]>
type iGetRegrasFaturamentoGeralFunction = () => Promise<iGetRegrasFaturamentoGeralResponse>
type iGerarBoletosFunction = (param: iGerarBoletosParam) => Promise<iGerarBoletosResponse>

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

export default {
    getClientesFaturados,
    getOrcamentosClienteFaturado,
    getRegrasFaturamentoGeral,
    gerarBoletos
}