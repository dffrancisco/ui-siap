import axios from "axios";

import {
    iGetClienteResponse,
    iGetMarcaAdicionadaResponse,
    iGetMarcaResponse,
    iParamGetClientes,
    iParamGetMarcas,
    iParamGetMarcasAdicionadas
} from "../interfaces";

type iGetClientesFunction = (param: iParamGetClientes) => Promise<iGetClienteResponse>;
type iGetMarcasFunction = (param: iParamGetMarcas) => Promise<iGetMarcaResponse>;
type iGetMarcasAdicionadas = (param: iParamGetMarcasAdicionadas) => Promise<iGetMarcaAdicionadaResponse>;

const caminho = 'siap/descontoCliente'

const getClientes: iGetClientesFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: "getClientes",
        offset,
        param
    })
    return data;
}

const getMarcas: iGetMarcasFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas",
        offset,
        param
    })
    return data;
}

const getMarcasAdicionadas: iGetMarcasAdicionadas = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: "getMarcasAdicionadas",
        offset,
        param
    })
    return data;
}

export default {
    getClientes,
    getMarcas,
    getMarcasAdicionadas
}