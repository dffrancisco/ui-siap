import axios from "axios";
import { iNota } from "../interfaces";
type iGetNotas = () => Promise<iNota[]>
type iGetItensNotas = (params: { ID_ENTRADA: string; CNPJ: string }) => Promise<any>;
type iUpdateProduto = (params: any) => Promise<any>;

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

export default {
    getNotas,
    getItensNotas,
    updateProduto
};