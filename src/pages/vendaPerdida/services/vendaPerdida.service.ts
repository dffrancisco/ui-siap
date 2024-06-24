import axios from "axios";
import { iGetVendasPerdidasResponse, iParamGetVendasPerdidas } from "../interfaces";

const caminho = 'siap/vendaPerdida'

type iGetVendasPerdidasFunction = (param: iParamGetVendasPerdidas) => Promise<iGetVendasPerdidasResponse[]>;

const getVendasPerdidas: iGetVendasPerdidasFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendasPerdidas",
        param
    });
    return data;
}

export default {
    getVendasPerdidas
}