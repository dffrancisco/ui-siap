import axios from "axios";
import { iParamsParaRelatorio, iResponseDadosProdutosVendidos } from "../interfaces";

const caminho = 'taap/relatorioProdutosVendidos';

type iGetDadosProdutosVendidos = (param: iParamsParaRelatorio) => Promise<iResponseDadosProdutosVendidos>;
type iGetMarcas = () => Promise<any>;


const getDadosParaRelatorio: iGetDadosProdutosVendidos = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaRelatorio",
        param
    });
    return data;
}

const getMarcas: iGetMarcas = async () => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas"
    });
    return data;
}

export default {
    getDadosParaRelatorio,
    getMarcas
}