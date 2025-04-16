import axios from "axios";
import {
    ParamsLojas,
    ParamsProdutos,
    ParamsOrcamentos,
    iResponseLojas,
    iResponseRelatorio,
    iResponseProdutos,
    iResponseOrcamentos,

} from "../interfaces";

const caminho = 'siap/produtosEntreLojas';

type GetLojas = () => Promise<iResponseLojas>;
type iGetDadosParaRelatorio = (param: ParamsLojas) => Promise<iResponseRelatorio>;
type GetProdutos = (param: ParamsProdutos) => Promise<iResponseProdutos>;
type GetOrcamentosProduto = (param: ParamsOrcamentos) => Promise<iResponseOrcamentos>;

const getLojas: GetLojas = async () => {
    const { data } = await axios.post(caminho, {
        call: "getLojas"
    });
    return data;
};
const getDadosParaRelatorio: iGetDadosParaRelatorio = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaRelatorio",
        param
    });
    return data;
}

const getProdutos: GetProdutos = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getProdutos",
        param
    });
    return data;
};

const getOrcamentosProduto: GetOrcamentosProduto = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getOrcamentosProduto",
        param
    });
    return data;
};


export default {
    getLojas,
    getDadosParaRelatorio,
    getProdutos,
    getOrcamentosProduto
};