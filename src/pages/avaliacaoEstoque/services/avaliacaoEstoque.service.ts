import axios from "axios";
import { iParamsRelatorio, iDadosAvaliacao, iResponseRelatorio } from "../interfaces";

const caminho = 'siap/avaliacaoEstoque'

type iGetDadosParaInputs = () => Promise<iDadosAvaliacao>;
type iGetDadosParaRelatorio = (param: iParamsRelatorio) => Promise<iResponseRelatorio>;

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}


const getDadosParaRelatorio: iGetDadosParaRelatorio = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaRelatorio",
        param
    });
    return data;
}

export default {
    getDadosParaInputs,
    getDadosParaRelatorio
}