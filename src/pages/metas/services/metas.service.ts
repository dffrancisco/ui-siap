import axios from "axios";
import { iGetMetasTracadaParam, iGetMetasTracadaResponse, iGetValoresParam, iGetValoresResponse } from "../interfaces";

const caminho = '/siap/metas'

type iGetMetasTracadaFunction = (param: iGetMetasTracadaParam) => Promise<iGetMetasTracadaResponse[]>
type iGetValoresFunction = (param: iGetValoresParam) => Promise<iGetValoresResponse[]>

const getMetasTracada: iGetMetasTracadaFunction = async (param) => {
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

export default {
    getMetasTracada,
    getValores,
}