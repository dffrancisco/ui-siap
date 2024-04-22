import axios from "axios";
import {
    iGetVendasResponse,
    iParamGetVendasDetalhes,
    iParamGetVendas,
    iGetVendasDetalhesResponse,
    iParamGetVendasGraficos,
    iGetVendasGraficosResponse,
    iGetFuncionariosResponse
} from "../interfaces";
const caminho = 'siap/vendaPorVendedor'

type iGetVendasFunction = (param: iParamGetVendas) => Promise<iGetVendasResponse[]>
type iGetVendasDetalhesFunction = (param: iParamGetVendasDetalhes) => Promise<iGetVendasDetalhesResponse>
type iGetVendasGraficosFunction = (param: iParamGetVendasGraficos) => Promise<iGetVendasGraficosResponse>
type iGetFuncionariosFunction = () => Promise<iGetFuncionariosResponse[]>

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

const getVendasGraficos: iGetVendasGraficosFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendasGraficos",
        param
    })

    return data;
}

const getFuncionarios: iGetFuncionariosFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getFuncionarios"
    })

    return data;
}

export default { getVendas, getVendasDetalhes, getVendasGraficos, getFuncionarios };