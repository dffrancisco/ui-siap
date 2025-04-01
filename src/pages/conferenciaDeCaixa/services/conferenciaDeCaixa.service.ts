import axios from "axios";
import { iCaixas, iParamFecharCaixa, iParamObs, iParamsAbrirCaixa, iParamSangria, iResponseDadosIniciais, iSangrias } from "../interfaces";

type iGetDadosIniciaisConfCaixa = (param: string) => Promise<iResponseDadosIniciais>
type iAbrirMDC = (param: string) => Promise<string>
type iAbrirCaixa = (param: iParamsAbrirCaixa) => Promise<iCaixas[]>
type iFecharCaixa = (param: iParamFecharCaixa) => Promise<iCaixas[]>
type iAdicionarSangria = (param: iParamSangria) => Promise<iSangrias[]>
type iAdicionarObs = (param: iParamObs) => Promise<any>

const caminho = "siap/conferenciaCaixa";

const getDadosIniciaisConfCaixa: iGetDadosIniciaisConfCaixa = async (param: string) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosIniciaisConfCaixa",
        param
    });
    return data;
}

const abrirMDC: iAbrirMDC = async (param: string) => {
    let { data } = await axios.post(caminho, {
        call: "abrirMDC",
        param
    });
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

const efetuarSangria: iAdicionarSangria = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "efetuarSangria",
        param
    })
    return data;
}

const salvarObs: iAdicionarObs = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "salvarObs",
        param
    })
    return data;
}

export default {
    getDadosIniciaisConfCaixa,
    abrirMDC,
    abrirCaixa,
    fecharCaixa,
    efetuarSangria,
    salvarObs
};