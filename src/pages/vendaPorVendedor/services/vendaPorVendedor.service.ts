import axios from "axios";
import {
    iGetVendasResponse,
    iParamGetVendasDetalhes,
    iParamGetVendas,
    iGetVendasDetalhesResponse
} from "../interfaces";
const caminho = 'siap/vendaPorVendedor'

type iGetVendasFunction = (param: iParamGetVendas) => Promise<iGetVendasResponse>
type iGetVendasDetalhesFunction = (param: iParamGetVendasDetalhes) => Promise<iGetVendasDetalhesResponse>

const getVendas: iGetVendasFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendas",
        param
    })

    return data;
}

const getVendasDetalhes: iGetVendasDetalhesFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendasDetalhes",
        param
    })

    return data;
}

export default { getVendas, getVendasDetalhes };