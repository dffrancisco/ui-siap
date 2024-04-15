import axios from "axios";
import {
    iGetVendasPorVendedorResponse,
    iParamGetVendasPorVendedor
} from "../interfaces";
const caminho = 'siap/vendaPorVendedor'

type iGetVendasPorVendedorFunction = (param: iParamGetVendasPorVendedor) => Promise<iGetVendasPorVendedorResponse[]>

const getVendas: iGetVendasPorVendedorFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendas",
        param
    })

    return data;
}

export default { getVendas };