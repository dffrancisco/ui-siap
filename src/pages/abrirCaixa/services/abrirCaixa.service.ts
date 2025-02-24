import axios from "axios";
import { iCaixasAbertos, iGetDadosCaixa, iParamsAbrirCaixa } from "../interfaces";
type iGetDadosAbrirCaixa = () => Promise<iGetDadosCaixa>
type iAbrirCaixa = (param: iParamsAbrirCaixa) => Promise<iCaixasAbertos[]>

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

const redirectConferencia = async () => {
    window.location.href = 'http://192.168.100.60/siap+/?p=conferencia_caixa/conferencia_caixa';
}

export default {
    getDadosAbrirCaixa,
    abrirMDC,
    abrirCaixa,
    redirectConferencia,
}