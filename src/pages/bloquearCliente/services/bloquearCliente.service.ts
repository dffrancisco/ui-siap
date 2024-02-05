import axios from "axios";

import {
    iBloquearClienteResponse,
    iDesbloquearClienteResponse,
    iGetBloqueioClienteResponse,
    iGetClientesResponse,
    iParamBloquearCliente,
    iParamDesbloquearCliente,
    iParamGetBloqueioCliente,
    iParamGetCliente
} from "../interfaces"

const caminho = 'siap/bloquearCliente'

type iGetClientesFunction = (param: iParamGetCliente) => Promise<iGetClientesResponse>
type iGetBloqueioClienteFunction = (param: iParamGetBloqueioCliente) => Promise<iGetBloqueioClienteResponse>
type iBloquearClienteFunction = (param: iParamBloquearCliente) => Promise<iBloquearClienteResponse>
type iDesbloquearClienteFunction = (param: iParamDesbloquearCliente) => Promise<iDesbloquearClienteResponse>

const getClientes: iGetClientesFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getClientes',
        offset,
        param
    })
    return data
}

const getBloqueioCliente: iGetBloqueioClienteFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getBloqueioCliente',
        offset,
        param
    })
    return data
}

const bloquearCliente: iBloquearClienteFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'bloquearCliente',
        param
    })
    return data
}

const desbloquearCliente: iDesbloquearClienteFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'desbloquearCliente',
        param
    })
    return data
}

export default {
    getClientes,
    getBloqueioCliente,
    desbloquearCliente,
    bloquearCliente
}