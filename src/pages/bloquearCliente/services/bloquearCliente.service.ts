import axios from "axios";

import { iGetClientesResponse, iParamGetCliente } from "../interfaces"

const caminho = 'siap/bloquearCliente'

type iGetClientesFunction = (param: iParamGetCliente) => Promise<iGetClientesResponse>


const getClientes: iGetClientesFunction = async ({offset, param}) => {
    let {data} = await axios.post(caminho, {
        call: 'getClientes',
        offset,
        param
    })
    return data
}

export default {
    getClientes
}