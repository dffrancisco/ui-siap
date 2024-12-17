import axios from "axios";
import { iParamsRelatorio, iResponseRelatorio } from "../interfaces";

const caminho = 'siap/avaliacaoEstoque'


type iGetDadosParaRelatorio = (param: iParamsRelatorio) => Promise<iResponseRelatorio>;


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