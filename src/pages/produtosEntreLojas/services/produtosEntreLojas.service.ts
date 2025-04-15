import axios from "axios";
import {
    ParamsLojas,
    ParamsProdutos,
    ParamsOrcamentos,
    iResponseLojas,
    iResponseVendaLoja,
    iResponseProdutos,
    iResponseOrcamentos
} from "../interfaces";

const caminho = 'siap/produtosEntreLojas';

type GetLojas = () => Promise<iResponseLojas>;
type VaiNaLoja = (param: ParamsLojas & { cnpj: string }) => Promise<iResponseVendaLoja>;
type GetProdutos = (param: ParamsProdutos) => Promise<iResponseProdutos>;
type GetOrcamentosProduto = (param: ParamsOrcamentos) => Promise<iResponseOrcamentos>;

const getLojas: GetLojas = async () => {
    const { data } = await axios.post(caminho, {
        call: "getLojas"
    });
    return data;
};

const vaiNaLoja: VaiNaLoja = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "vaiNaLoja",
        param: {
            cnpj: param.cnpj,
            mes: param.mes,
            ano: param.ano
        }
    });
    return data;
};

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
    vaiNaLoja,
    getProdutos,
    getOrcamentosProduto
};