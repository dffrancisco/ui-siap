import axios from "axios";
import { iBoletosAbertos, iBoletosAtrasados, iBoletosEmDia, iClientes, iGetClientes, iParamRequisicoes, iResponseDadosCliente, iTodosBoletos } from "../interfaces";

const caminho = 'siap/consultaCliente'

type iGetClientesFuction = (param: iGetClientes, offset: number) => Promise<iClientes>
type iGetDadosClienteFunction = (param: iParamRequisicoes) => Promise<iResponseDadosCliente>
type iGetBoletosEmAbertoFunction = (param: number) => Promise<iBoletosAbertos[]>
type iGetBoletosAtrasadosFunction = (param: number) => Promise<iBoletosAtrasados[]>
type iGetBoletosEmDiaFunction = (param: number) => Promise<iBoletosEmDia[]>
type iGetTodosBoletosFunction = (param: number) => Promise<iTodosBoletos[]>

const getClientes: iGetClientesFuction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getClientes",
        offset,
        param
    });

    return data;
}

const requisicoesDadosCliente: iGetDadosClienteFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "requisicoesDadosCliente",
        param
    });

    return data;
}

const getBoletosEmAberto: iGetBoletosEmAbertoFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getBoletosEmAberto",
        param
    });

    return data;
}

const getBoletosAtrasados: iGetBoletosAtrasadosFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getBoletosAtrasados",
        param
    });

    return data;
}

const getBoletosEmDia: iGetBoletosEmDiaFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getBoletosEmDia",
        param
    });

    return data;
}

const getTodosBoletos: iGetTodosBoletosFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getTodosBoletos",
        param
    });

    return data;
}

export default {
    getClientes,
    requisicoesDadosCliente,
    getBoletosEmAberto,
    getBoletosAtrasados,
    getBoletosEmDia,
    getTodosBoletos
}