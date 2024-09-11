import axios from "axios";
import { iGetFeriadosParam, iGetFeriadosResponse, iGetMetasTracadasParam, iGetMetasTracadasResponse, iGetValoresParam, iGetValoresResponse } from "../interfaces";

const caminho = '/siap/metas'

type iGetMetasTracadasFunction = (param: iGetMetasTracadasParam) => Promise<iGetMetasTracadasResponse[]>
type iGetValoresFunction = (param: iGetValoresParam) => Promise<iGetValoresResponse>
type iGetFeriadosFunction = (param: iGetFeriadosParam) => Promise<iGetFeriadosResponse>

const getMetasTracadas: iGetMetasTracadasFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getMetasTracada",
        param
    })

    return data;
}

const getValores: iGetValoresFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getValores",
        param
    })

    return data;
}

const getFeriados: iGetFeriadosFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getFeriados",
        param
    })

    return data;
}

export default {
    getMetasTracadas,
    getValores,
    getFeriados
}