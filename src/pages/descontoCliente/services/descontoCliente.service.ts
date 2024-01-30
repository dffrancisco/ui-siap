import axios from "axios";

import {
    iGetClienteResponse,
    iParamGetClientes,
} from "../interfaces";

type iGetClientesFunction = (param: iParamGetClientes) => Promise<iGetClienteResponse>;

const caminho = 'siap/descontoCliente'

const getClientes: iGetClientesFunction = async ({offset, param}) => {
    let {data} = await axios.post(caminho,{
        call: "getClientes",
        offset,
        param
    })
    return data;
}

export default { getClientes }