import axios from "axios";
import { iParams, iResponseMarcasCarros } from "../interfaces";

const caminho = 'taap/estoqueOrganico'

type iGetDadosParaInputs = () => Promise<iResponseMarcasCarros>;
type iGetDadosParaRelatorio = (param: iParams) => Promise<any>;

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}

const getDadosEstoqueOrganico: iGetDadosParaRelatorio = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosEstoqueOrganico",
        param
    });
    return data;
}

export default {
    getDadosParaInputs,
    getDadosEstoqueOrganico
}