import axios from "axios";
import { iDadosParaRelatorio, iFuncionario, iGetProdutosParam, iMarcas, iParamParaRelatorio, iProdutos } from "../interfaces";

const caminho = "siap/comissaoMarca";

type iGetFuncionarios = () => Promise<iFuncionario[]>
type iGetMarcas = () => Promise<iMarcas[]>
type iGetProdutos = (param: iGetProdutosParam) => Promise<iProdutos[]>
type iGetDadosVendaMarca = (param: iParamParaRelatorio) => Promise<iDadosParaRelatorio[]>

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

const getDadosVendaMarcaPorVendedor: iGetDadosVendaMarca = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosVendaMarcaPorVendedor",
        param
    });

    return data;
}

const getDadosVendaMarcaPorItens: iGetDadosVendaMarca = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosVendaMarcaPorItens",
        param
    });

    return data;
}

export default {
    getFuncionarios,
    getMarcas,
    getProdutos,
    getDadosVendaMarcaPorVendedor,
    getDadosVendaMarcaPorItens
}