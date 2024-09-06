import axios from "axios"
import { iGetClientesResponse, iParamDetalhesCliente, iParamGetCliente } from "../interfaces"

const caminho = 'siap/liberarCliente'

type iGetClientesFunction = (param: iParamGetCliente) => Promise<iGetClientesResponse>
type iGetDetalhesCliente = (param: iParamDetalhesCliente) => Promise<any>

const getClientes: iGetClientesFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getClientes',
        offset,
        param
    })
    return data
}

const getDetalhesCliente: iGetDetalhesCliente = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: 'getDetalhesCliente',
        offset,
        param
    })
    return data
}

export default {
    getClientes,
    getDetalhesCliente
}