import axios from "axios";
import {
    iGetClientesFaturadosParam, iGetClientesFaturadosResponse, iGetOrcamentosClienteFaturadoParam,
    iGetOrcamentosClienteFaturadoResponse
} from "../interfaces";

const caminho = 'taap/relatorioFaturamento'

type iGetClientesFaturadosFuction = (param: iGetClientesFaturadosParam, offset: number) =>
    Promise<iGetClientesFaturadosResponse>

type iGetOrcamentosClienteFaturadoFunction = (param: iGetOrcamentosClienteFaturadoParam) =>
    Promise<iGetOrcamentosClienteFaturadoResponse[]>

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

export default {
    getClientesFaturados,
    getOrcamentosClienteFaturado
}