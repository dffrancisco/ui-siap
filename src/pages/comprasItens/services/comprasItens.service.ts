import axios from "axios";

import {
    iParamGetDadosIniciais,
    iParamGetProdutosFunction,
    iResponseGetDadosIniciais,
    iObjHistoricoVendaGeral,
    iResponseGetProdutosFunction,
    iObjHistoricoCompraGeral
} from "../interfaces";

const caminho = "siap/compras";

const { CancelToken } = axios
let cancel;

type iGetDadosIniciaisFunction = (param: iParamGetDadosIniciais) => Promise<iResponseGetDadosIniciais>;
type iGetProdutosFunction = (param: iParamGetProdutosFunction) => Promise<iResponseGetProdutosFunction>;
type iGetHistoricoVendasFunction = (param: iParamGetProdutosFunction) => Promise<iObjHistoricoVendaGeral>;
type iGetHistoricoComprasFunction = (param: iParamGetProdutosFunction) => Promise<iObjHistoricoCompraGeral>;

export const getColorCurva = (curva: string) => {
    let objCurva = {
        AA: '#3ec9f7',
        A: '#24d4e0',
        B: '#97f7fd',
        C: '#fbe2b2',
        D: '#97abfd',
        E: '#ea9494',
    }

    return objCurva[curva] || '#f9baba'
}

const getDadosIniciais: iGetDadosIniciaisFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosIniciais",
        param,
    });
    return data;
};

const getProdutos: iGetProdutosFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getProdutos",
        param,
    });
    return data;
};

const getHistoricoVendas: iGetHistoricoVendasFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getHistoricoVendas",
        param,
    }, {
        cancelToken: new CancelToken(function executor(c) {
            cancel = c;
        })
    });
    return data;
};

const getHistoricoCompras: iGetHistoricoComprasFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getHistoricoCompras",
        param,
    }, {
        cancelToken: new CancelToken(function executor(c) {
            cancel = c;
        })
    });
    return data;
};

const cancelarRequisicao = () => {
    if (cancel) {
        cancel('Requisição cancelada pelo usuário.');
    }
}

export default {
    getColorCurva,
    getDadosIniciais,
    getProdutos,
    getHistoricoVendas,
    getHistoricoCompras,
    cancelarRequisicao
};
