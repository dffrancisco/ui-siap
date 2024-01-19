import axios from "axios";
import { iParamGetProdutos, iGetProdutosResponse, iParamToInsert, iParamToUpdate } from "../interfaces"

const caminho = "siap/montagemProduto";

type iGetProdutosFunction = (param: iParamGetProdutos) => Promise<iGetProdutosResponse>;
type iToInsertFunction = (param: iParamToInsert) => Promise<void>;
type iToUpdateFuntion = (param: iParamToUpdate) => Promise<void>;

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

const toUpdate: iToUpdateFuntion = async (param: any) => {
    let { data } = await axios.post(caminho, {
        call: "update",
        param
    });

    return data;
}

export default {
    getProdutos,
    getCarros,
    toInsert,
    toUpdate
}