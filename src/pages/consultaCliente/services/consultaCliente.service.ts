import axios from "axios";
import { iClientes, iGetClientes, iParamRequisicoes, iResponseDadosCliente } from "../interfaces";

const caminho = 'siap/consultaCliente'

type iGetClientesFuction = (param: iGetClientes, offset: number) => Promise<iClientes>
type iGetDadosClienteFunction = (param: iParamRequisicoes) => Promise<iResponseDadosCliente>

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

export default {
    getClientes,
    requisicoesDadosCliente,
}