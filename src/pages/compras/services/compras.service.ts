import axios from "axios";
import {
    iCompra, iMarca, iParamDeleteCompra, iParamInsertCompra, iParamUpdateCompra,
    iResponseInsertCompra, iResponseGetProdutosAdicionadosFunction, iTransportadora
} from "../interfaces";

const caminho = "siap/compras";

type iGetComprasFunction = () => Promise<iCompra[]>;
type iGetMarcasFunction = () => Promise<iMarca[]>;
type iInsertCompraFunction = (param: iParamInsertCompra) => Promise<iResponseInsertCompra>;
type iUpdateCompraFunction = (param: iParamUpdateCompra) => Promise<void>;
type iDeleteCompraFunction = (param: iParamDeleteCompra) => Promise<void>;
type iGetProdutosAdicionadosFunction = (idCompras: number) => Promise<iResponseGetProdutosAdicionadosFunction>;
type iGetTransportadorasFunction = () => Promise<iTransportadora[]>;

const getCompras: iGetComprasFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCompras",
    });
    return data;
};

const getMarcas: iGetMarcasFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas",
    });
    return data;
};

const insertCompra: iInsertCompraFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertCompra",
        param
    });
    return data;
};

const updateCompra: iUpdateCompraFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "updateCompra",
        param,
    });
    return data;
};

const deleteCompra: iDeleteCompraFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deleteCompra",
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

const getTransportadoras: iGetTransportadorasFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getTransportadoras",
    });
    return data;
};

export default {
    getCompras,
    getMarcas,
    insertCompra,
    updateCompra,
    deleteCompra,
    getProdutosAdicionados,
    getTransportadoras,
};
