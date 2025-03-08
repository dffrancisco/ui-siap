import axios from "axios";
import { iParamFecharCaixa, iParamsAbrirCaixa, iResponseDadosIniciais } from "../interfaces";

type iGetDadosIniciaisConfCaixa = (param: string) => Promise<iResponseDadosIniciais>
type iAbrirMDC = (param: string) => Promise<any>
type iAbrirCaixa = (param: iParamsAbrirCaixa) => Promise<any[]>
type iFecharCaixa = (param: iParamFecharCaixa) => Promise<any[]>

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


export default {
    getDadosIniciaisConfCaixa,
    abrirMDC,
    abrirCaixa,
    fecharCaixa
};