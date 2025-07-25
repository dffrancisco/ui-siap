import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { iOrcamento, iOrcamentosData, iParamOrcamento, iParamOrcamentosData, iSociedade } from "../interface";


const caminho = 'siap/cabongo'

type igetOrcamentoFunction = (param: iParamOrcamento) => Promise<iOrcamento[]>;
type igetSociedade = () => Promise<iOrcamento[]>
type igetEmpresa = () => Promise<{ CGC_EMPRESA: string }>
type igetOrcamentosData = (param: iParamOrcamentosData) => Promise<iOrcamentosData[]>

const getSociedade: igetSociedade = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getSociedade',
    })
    return data
}

const getEmpresa: igetEmpresa = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getEmpresa',

    })
    return data
}

const getOrcamento: igetOrcamentoFunction = async ({ id_sociedade, cnpj, dataOrcamentoPesquisa }) => {
    let { data } = await axios({
        method: 'POST',
        url: caminho,
        timeout: 20000,
        data: {
            call: 'getOrcamentos',
            id_sociedade,
            param: {
                cnpj,
                dataOrcamentoPesquisa,
            },
        },
    });

    return data;
};

const getOrcamentoData: igetOrcamentosData = async ({ id_sociedade, cnpj }) => {
    let { data } = await axios.post(caminho, {
        call: 'getOrcamentosData',
        id_sociedade,
        param: {
            cnpj
        }

    })
    return data
}

export default {
    getSociedade,
    getEmpresa,
    getOrcamento,
    getOrcamentoData
}