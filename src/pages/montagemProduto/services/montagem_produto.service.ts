import axios from "axios";
import { iParamGetProdutos, iGetProdutosResponse } from "../interfaces"

const caminho = "siap/montagemProduto";

type iGetProdutosFunction = (param: iParamGetProdutos) => Promise<iGetProdutosResponse>;

const getProdutos: iGetProdutosFunction = async ({ param, offset }) => {
    let { data } = await axios.post(caminho, {
        call: "getProdutos",
        offset,
        param
    });

    return data;
}

const getCarros = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCarros"
    });

    return data;
}

export default {
    getProdutos,
    getCarros
}