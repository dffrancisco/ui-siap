import axios from "axios";
import { iGetMetasTracadasEFeriadosParam, iGetMetasEFeriadosResponse, iGetValoresParam, iGetValoresResponse } from "../interfaces";

const caminho = '/siap/metas'

type iGetMetasTracadasEFeriadosFunction = (param: iGetMetasTracadasEFeriadosParam) => Promise<iGetMetasEFeriadosResponse>
type iGetValoresFunction = (param: iGetValoresParam) => Promise<iGetValoresResponse>

const getMetasTracadasEFeriados: iGetMetasTracadasEFeriadosFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getMetasTracadaEFeriados",
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

export default {
    getMetasTracadasEFeriados,
    getValores,
}