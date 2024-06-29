import axios from "axios";
import { iFuncionario, iMarcas, iProdutos } from "../interfaces";

const caminho = "siap/comissaoMarca";


type iGetFuncionarios = () => Promise<iFuncionario[]>
type iGetMarcas = () => Promise<iMarcas[]>
type iGetProdutos = () => Promise<iProdutos[]>

const getFuncionarios: iGetFuncionarios = async () => {
    let { data } = await axios.post(caminho, {
        call: "getFuncionarios",
    });

    return data;
}

const getMarcas: iGetMarcas = async () => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas",
    });

    return data;
}

const getProdutos: iGetProdutos = async () => {
    let { data } = await axios.post(caminho, {
        call: "getProdutos",
    });

    return data;
}

export default {
    getFuncionarios,
    getMarcas,
    getProdutos,
}