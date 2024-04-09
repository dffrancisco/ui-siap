import axios from "axios";
import {
    iCompra, iMarca, iParamDeleteCompra, iParamInsertCompra, iParamUpdateCompra, iResponseInsertCompra,
} from "../interfaces";

const caminho = "siap/compras";

type iGetComprasFunction = () => Promise<iCompra[]>;
type iGetMarcasFunction = () => Promise<iMarca[]>;
type iInsertCompraFunction = (param: iParamInsertCompra) => Promise<iResponseInsertCompra>;
type iUpdateCompraFunction = (param: iParamUpdateCompra) => Promise<void>;
type iDeleteCompraFunction = (param: iParamDeleteCompra) => Promise<void>;

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
    console.log('aaaaaa');
    console.log(param);
    let { data } = await axios.post(caminho, {
        call: "deleteCompra",
        param,
    });
    return data;
};

export default {
    getCompras,
    getMarcas,
    insertCompra,
    updateCompra,
    deleteCompra,
};
