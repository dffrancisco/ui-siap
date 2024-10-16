import axios from "axios"
import { iGetClientesResponse, iParamDetalhesCliente, iParamGetCliente, iParamUpdateCliente } from "../interfaces"

const caminho = 'siap/liberarCliente'

type iGetClientesFunction = (param: iParamGetCliente) => Promise<iGetClientesResponse>
type iGetDetalhesCliente = (param: iParamDetalhesCliente) => Promise<any>
type iUpdateCliente = (param: iParamUpdateCliente) => Promise<any>

const getClientes: iGetClientesFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getClientes',
        offset,
        param
    })
    return data
}

const getLiberacoes: iGetDetalhesCliente = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getLiberacoes',
        offset,
        param
    })
    return data
}

const getBloqueiosDesbloqueios: iGetDetalhesCliente = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getBloqueiosDesbloqueios',
        offset,
        param
    })
    return data
}

const getCompras: iGetDetalhesCliente = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getCompras',
        offset,
        param
    })
    return data
}

const getBoletos: iGetDetalhesCliente = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getBoletos',
        offset,
        param
    })
    return data
}

const updateCliente: iUpdateCliente = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'updateCliente',
        param
    })
    return data
}

export default {
    getClientes,
    getLiberacoes,
    getBloqueiosDesbloqueios,
    getCompras,
    getBoletos,
    updateCliente
}