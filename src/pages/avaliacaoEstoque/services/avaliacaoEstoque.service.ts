import axios from "axios";
import { iParams, iResponseRelatorio } from "../interfaces";

const caminho = 'siap/relatorioAvaliacoes';

type iGetAvaliacao = (param: iParams) => Promise<iResponseRelatorio>;
type iGetProdutosAvaliados = (param: iParams) => Promise<iResponseRelatorio>;

const getAvaliacao: iGetAvaliacao = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getAvaliacao",
        param,
    });
    return data;
};

const getProdutosAvaliados: iGetProdutosAvaliados = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getProdutosAvaliados",
        param,
    });
    return data;
};

export default {
    getAvaliacao,
    getProdutosAvaliados,
};
