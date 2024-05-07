import axios from "axios";

import {
    iParamGetDadosIniciais,
    iParamGetProdutosFunction,
    iResponseGetDadosIniciais,
    iObjHistoricoVendaGeral,
    iResponseGetProdutosFunction,
    iObjHistoricoCompraGeral,
    iParamInsertItemCompra,
    iResponseInsertItemCompra,
    iResponseGetProdutosAdicionadosFunction,
    iParamDeleteItemCompra,
    iGetListaFotoJsonResponse,
} from "../interfaces";
import moment from "moment";

const caminho = "siap/compras";

const { CancelToken } = axios
let cancel;

type iGetDadosIniciaisFunction = (param: iParamGetDadosIniciais) => Promise<iResponseGetDadosIniciais>;
type iGetProdutosFunction = (param: iParamGetProdutosFunction) => Promise<iResponseGetProdutosFunction>;
type iGetProdutosAdicionadosFunction = (idCompras: number) => Promise<iResponseGetProdutosAdicionadosFunction>;
type iGetHistoricoVendasFunction = (param: iParamGetProdutosFunction) => Promise<iObjHistoricoVendaGeral>;
type iGetHistoricoComprasFunction = (param: iParamGetProdutosFunction) => Promise<iObjHistoricoCompraGeral>;
type iInsertItemCompraFunction = (param: iParamInsertItemCompra) => Promise<iResponseInsertItemCompra>;
type iDeleteItemCompraFunction = (param: iParamDeleteItemCompra) => Promise<void>;
type iGetListaFotoJsonFunction = (codProduto: number) => Promise<iGetListaFotoJsonResponse[]>

export const getColorData = (data: string) => {
    if (!data) return "#eef0f4";

    let dataLimite = moment().subtract(1, "year");
    let dataVenda = moment(data.substring(0, 10));

    return moment(dataVenda).isBefore(dataLimite) ? "#ff7da1" : "#eef0f4";
}

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

export const getColorDescricao = (qtdJaAdicionadaItem: number, novoItem: 'OLD' | 'NEW') => {
    if (qtdJaAdicionadaItem > 0) {
        return '#97cdff';
    }

    if (novoItem == 'NEW') {
        return '#60f3c6';
    }

    return '#eef0f4'
}

export const getColorQtdEstoque = (qtdMedia: number, qtdEstoque: number) => {

    if (qtdEstoque < qtdMedia) {
        return '#ff7da1'
    }

    return '#eef0f4'
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

const getProdutosAdicionados: iGetProdutosAdicionadosFunction = async (idCompras) => {
    let { data } = await axios.post(caminho, {
        call: "getProdutosAdicionados",
        param: {
            ID_COMPRAS: idCompras,
        },
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

const insertItemCompra: iInsertItemCompraFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertItemCompra",
        param,
    })

    return data;
};

const deleteItemCompra: iDeleteItemCompraFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deleteItemCompra",
        param,
    });
    return data;
};

const cancelarRequisicao = () => {
    if (cancel) {
        cancel('Requisição cancelada pelo usuário.');
    }
}

const getListaFotoJson: iGetListaFotoJsonFunction = async (codProduto: number) => {
    let { data } = await axios.post(
        `http://www.reallatas.com.br/balcao/getListaFotoJson.php?id_sociedade=&img=${codProduto}`
    );

    return data;
}

export default {
    getColorCurva,
    getColorData,
    getColorDescricao,
    getColorQtdEstoque,
    getDadosIniciais,
    getProdutos,
    getProdutosAdicionados,
    getHistoricoVendas,
    getHistoricoCompras,
    insertItemCompra,
    deleteItemCompra,
    cancelarRequisicao,
    getListaFotoJson
};
