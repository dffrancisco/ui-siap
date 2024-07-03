import axios from "axios";
import { iGetDetalhesResponse, iGetVendasPerdidasResponse, iParamDetalhes, iParamGetVendasPerdidas } from "../interfaces";

const caminho = 'siap/vendaPerdida'

type iGetVendasPerdidasFunction = (param: iParamGetVendasPerdidas) => Promise<iGetVendasPerdidasResponse[]>;
type iGetDetalhesFunction = (param: iParamDetalhes) => Promise<iGetDetalhesResponse[]>

const getVendasPerdidas: iGetVendasPerdidasFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendasPerdidas",
        param
    });
    return data;
}

const getVendaPerdidaDetalhes: iGetDetalhesFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendaPerdidaDetalhes",
        param
    });
    return data;
}

export default {
    getVendasPerdidas,
    getVendaPerdidaDetalhes
}