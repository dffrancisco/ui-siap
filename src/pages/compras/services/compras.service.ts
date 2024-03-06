import axios from "axios";
import {
    iCompra, iMarca,
} from "../interfaces";

const caminho = "siap/compras";

type iGetComprasFunction = () => Promise<iCompra[]>;
type iGetMarcasFunction = () => Promise<iMarca[]>;
type iInsertCompraFunction = (param: iParamInsertCompra) => Promise<iCompra>;

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

const insertCompra: iInsertCompraFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas",
    });
    return data;
};

export default {
    getCompras,
    getMarcas
};
