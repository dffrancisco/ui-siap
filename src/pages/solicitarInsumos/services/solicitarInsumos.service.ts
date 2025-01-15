import axios from "axios";
import { iCategorias, iGetItens, iItens } from "../interfaces";
type iGetCategoriasFunction = () => Promise<iCategorias[]>;
type iGetItensFunction = (param: iGetItens, categoria: number) => Promise<iItens[]>;

const caminho = 'siap/solicitarInsumos'

const getCategorias: iGetCategoriasFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCategorias"
    });
    return data;
}

const getItens: iGetItensFunction = async (param, categoria) => {
    let { data } = await axios.post(caminho, {
        call: "getItens",
        param,
        categoria
    });
    return data;
}

export default {
    getCategorias,
    getItens,
}