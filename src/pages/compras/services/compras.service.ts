import axios from "axios";
import {
    iCompra,
} from "../interfaces";

const caminho = "siap/compras";

type iGetComprasFunction = () => Promise<iCompra[]>;

const getCompras: iGetComprasFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCompras",
    });
    return data;
};

export default {
    getCompras
};
