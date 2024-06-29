import axios from "axios";
import { iFuncionario, iMarcas, iProdutos } from "../interfaces";

const caminho = "siap/comissaoMarca";


type iGetFuncionarios = () => Promise<iFuncionario[]>
type iGetMarcas = () => Promise<iMarcas[]>
type iGetProdutos = (param: any) => Promise<iProdutos[]>

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

const getProdutos: iGetProdutos = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getProdutos",
        param
    });

    return data;
}

export default {
    getFuncionarios,
    getMarcas,
    getProdutos,
}