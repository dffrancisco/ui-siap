import axios from 'axios';
import {
    iGetDevolucaoInfResponse,
    iGetMontagemInfResponse,
    iGetRelatorioMontagensResponse,
    iParamGetDevolucaoInf,
    iParamGetMontagemInf,
    iParamGetRelatorioMontagens
} from '../interfaces';

const caminho = "siap/consultaMontagem"

type iGetRelatorioMontagensFunction = (param: iParamGetRelatorioMontagens) => Promise<iGetRelatorioMontagensResponse[]>;
type iGetMontagemInfFunction = (param: iParamGetMontagemInf) => Promise<iGetMontagemInfResponse>;
type iGetDevolucaoInfFunction = (param: iParamGetDevolucaoInf) => Promise<iGetDevolucaoInfResponse>;

const getRelatorioMontagens: iGetRelatorioMontagensFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getRelatorioMontagens",
        param
    });
    return data
};

const getMontagemInf: iGetMontagemInfFunction = async ({ param, offset }) => {
    let { data } = await axios.post(caminho, {
        call: "getMontagemInf",
        param,
        offset
    })
    return data
}

const getDevolucoesInf: iGetDevolucaoInfFunction = async ({ param, offset }) => {
    let { data } = await axios.post(caminho, {
        call: "getDevolucoesInf",
        param,
        offset
    })
    return data
}

export default {
    getRelatorioMontagens,
    getMontagemInf,
    getDevolucoesInf
}