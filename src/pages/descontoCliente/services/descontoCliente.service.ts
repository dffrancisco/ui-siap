import axios from "axios";

import {
    iAdicionarMarcaResponse,
    iGetClienteResponse,
    iGetMarcaAdicionadaResponse,
    iGetMarcaResponse,
    iParamAdicionarMarca,
    iParamGetClientes,
    iParamGetMarcas,
    iParamGetMarcasAdicionadas
} from "../interfaces";

type iGetClientesFunction = (param: iParamGetClientes) => Promise<iGetClienteResponse>;
type iGetMarcasFunction = (param: iParamGetMarcas) => Promise<iGetMarcaResponse>;
type iGetMarcasAdicionadas = (param: iParamGetMarcasAdicionadas) => Promise<iGetMarcaAdicionadaResponse>;
type iAdicionarMarcaFuntion = (param: iParamAdicionarMarca) => Promise<iAdicionarMarcaResponse>

const caminho = 'taap/descontoCliente'

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

const adicionarMarca: iAdicionarMarcaFuntion = async (newFields) => {
    let { data } = await axios.post(caminho, {
        call: "adicionarMarca",
        param: newFields
    })
    return data;
}

const removerMarca = async (idMarca: number, idCliente: number) => {
    let { data } = await axios.post(caminho, {
        call: "removerMarca",
        param: {
            ID_MARCA: idMarca,
            ID_CLIENTE: idCliente
        }
    })
    return data;
}

export default {
    getClientes,
    getMarcas,
    getMarcasAdicionadas,
    removerMarca,
    adicionarMarca
}