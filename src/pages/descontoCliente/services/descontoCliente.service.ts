import axios from "axios";

import {
    iGetClienteResponse,
    iGetMarcaResponse,
    iParamGetClientes,
    iParamGetMarcas,
} from "../interfaces";

type iGetClientesFunction = (param: iParamGetClientes) => Promise<iGetClienteResponse>;
type iGetMarcasFunction = (param: iParamGetMarcas) => Promise<iGetMarcaResponse>;

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

export default {
    getClientes,
    getMarcas
}