import axios from "axios";
import { iParamGetProdutos, iGetProdutosResponse, iParamToInsert } from "../interfaces"

const caminho = "siap/montagemProduto";

type iGetProdutosFunction = (param: iParamGetProdutos) => Promise<iGetProdutosResponse>;
type iToInsertFunction = (param: iParamToInsert) => Promise<void>;

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

const toInsert: iToInsertFunction = async (newFields) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields
    });

    return data;
}

export default {
    getProdutos,
    getCarros,
    toInsert
}