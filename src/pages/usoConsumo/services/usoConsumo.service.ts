import axios from "axios";
import { iDadosUsoConsumo, iParamsUsoConsumo } from "../interfaces";

const caminho = 'siap/avaliacaoEstoque'


type iGetDadosParaRelatorio = (param: iDadosUsoConsumo) => Promise<iParamsUsoConsumo>;


const getDadosParaRelatorio: iGetDadosParaRelatorio = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaRelatorio",
        param
    });
    return data;
}

export default {

    getDadosParaRelatorio
}