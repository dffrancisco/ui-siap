import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { iParamOrcamento } from "../interface";

export async function axiosWithTimeout<T = any>(
    config: AxiosRequestConfig,
    timeout = 5000
): Promise<AxiosResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await axios({
            ...config,
            signal: controller.signal,
        });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

const caminho = 'siap/cabongo'

type igetOrcamentoFunction = (param: iParamOrcamento) => Promise<void>;

const getSociedade = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getSociedade',

    })
    return data
}

const getEmpresa = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getEmpresa',

    })
    return data
}

const getOrcamento: igetOrcamentoFunction = async ({ id_sociedade, cnpj, dataOrcamentoPesquisa }) => {
    let { data } = await axiosWithTimeout({
        method: 'POST',
        url: caminho,
        data: {
            call: 'getOrcamentos',
            id_sociedade,
            param: {
                cnpj,
                dataOrcamentoPesquisa,
            },
        },
    }, 5000);

    return data;
};

const getOrcamentoData = async ({ }) => {
    let { data } = await axios.post(caminho, {
        call: 'getOrcamentoData',

    })
    return data
}

export default {
    getSociedade,
    getEmpresa,
    getOrcamento,
    getOrcamentoData
}