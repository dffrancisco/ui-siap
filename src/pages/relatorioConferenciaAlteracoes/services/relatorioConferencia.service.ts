import axios from "axios";
import { iParams, iResponseDadosInput, iResponseRelatorio } from "../interfaces";

const caminho = 'taap/relatorioConferenciaAlteracoes'

type iGetDadosParaInputs = () => Promise<iResponseDadosInput>;
type iGetDadosParaRelatorio = (param: iParams) => Promise<iResponseRelatorio>;

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