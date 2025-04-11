import axios from "axios";
import { iItemNota, iNota, iParamUpdateProdutos, iRespostaAtualizacao } from "../interfaces";
type iGetNotas = () => Promise<iNota[]>
type iGetItensNotas = (params: { ID_ENTRADA: string; CNPJ: string }) => Promise<iItemNota[]>;
type iUpdateProduto = (params: any) => Promise<any>;
type iDeleteNota = (params: { ID_ENTRADA: string; CNPJ: string }) => Promise<string>;
type iAtualizar = (params: iParamUpdateProdutos) => Promise<iRespostaAtualizacao>;

const caminho = "siap/equalizaPrecoLojas";

const getNotas: iGetNotas = async () => {
    let { data } = await axios.post(caminho, {
        call: "getNotas"
    });
    return data;
}

const getItensNotas: iGetItensNotas = async (params) => {
    let { data } = await axios.post(caminho, {
        call: "getItensNotas",
        param: params
    });
    return data;
}

const updateProduto: iUpdateProduto = async () => {
    let { data } = await axios.post(caminho, {
        call: "updateProduto"
    });
    return data;
}

const deleteNota: iDeleteNota = async (params) => {
    let { data } = await axios.post(caminho, {
        call: "deleteNota",
        param: params
    });
    return data;
}

const atualizarProdutos: iAtualizar = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "atualizarProdutos",
        param: param
    });
    return data;
}

export default {
    getNotas,
    getItensNotas,
    updateProduto,
    deleteNota,
    atualizarProdutos
};