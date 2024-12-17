import axios from "axios";
import { iCaixasAbertos, iGetDadosCaixa, iParamFecharCaixa, iParamsAbrirCaixa } from "../interfaces";
type iGetDadosAbrirCaixa = () => Promise<iGetDadosCaixa>
type iAbrirCaixa = (param: iParamsAbrirCaixa) => Promise<iCaixasAbertos[]>
type iFecharCaixa = (param: iParamFecharCaixa) => Promise<iCaixasAbertos[]>

const caminho = 'siap/abrirCaixa'

const getDadosAbrirCaixa: iGetDadosAbrirCaixa = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosAbrirCaixa"
    })
    return data;
}

const abrirMDC = async () => {
    let { data } = await axios.post(caminho, {
        call: "abrirMDC"
    })
    return data;
}

const abrirCaixa: iAbrirCaixa = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "abrirCaixa",
        param
    })
    return data;
}

const fecharCaixa: iFecharCaixa = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "fecharCaixa",
        param
    })
    return data;
}

export default {
    getDadosAbrirCaixa,
    abrirMDC,
    abrirCaixa,
    fecharCaixa,
}