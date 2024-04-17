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
    getDadosIniciais,
    getProdutos,
    getHistoricoVendas,
    getHistoricoCompras,
    cancelarRequisicao
};
