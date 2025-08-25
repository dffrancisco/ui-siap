import axios from "axios";
import {
    iParamGetProdutos, iGetProdutosResponse, iParamToInsert, iParamToUpdate,
    iGetInsertResponse
} from "../interfaces"

const caminho = "taap/montagemProduto";

type iGetProdutosFunction = (param: iParamGetProdutos) => Promise<iGetProdutosResponse>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iGetInsertResponse>;
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

const toDelete = async (id_produto_montagem) => {
    return axios.post(caminho, {
        call: "delete",
        id_produto_montagem: id_produto_montagem
    });
};

export default {
    getProdutos,
    getCarros,
    toInsert,
    toUpdate,
    toDelete
}