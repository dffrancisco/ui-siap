import axios from "axios";
import { iParams, iResponseDadosInput } from "../interfaces";

const caminho = 'siap/relatorioConferenciaAlteracoes'

type iGetDadosParaInputs = () => Promise<iResponseDadosInput>;
type iGetDadosParaRelatorio = (param: iParams) => Promise<any>;

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}

const getDadosParaRelatorio: iGetDadosParaRelatorio = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaRelatorio",
    });
    return data;
}

export default {
    getDadosParaInputs,
    getDadosParaRelatorio
}