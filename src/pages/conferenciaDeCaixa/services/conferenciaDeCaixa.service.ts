import axios from "axios";
import { iResponseDadosIniciais } from "../interfaces";

type iGetDadosIniciaisConfCaixa = (param: string) => Promise<iResponseDadosIniciais>
type iAbrirMDC = (param: string) => Promise<any>

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


export default {
    getDadosIniciaisConfCaixa,
    abrirMDC
};