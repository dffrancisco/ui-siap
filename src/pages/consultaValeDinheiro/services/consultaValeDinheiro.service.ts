import axios from "axios";
import { iResponseDadosInput, iResponseVales } from "../interfaces";

const caminho = 'siap/consultaValeDinheiro'

type iGetDadosParaInputs = () => Promise<iResponseDadosInput>;
type iGetConsultarVales = (codFuncionario: string, dataInicio: string, dataFim: string) => Promise<iResponseVales>;

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}

const getConsultarVales: iGetConsultarVales = async (codFuncionario, dataInicio, dataFim) => {
    let { data } = await axios.post(caminho, {
        call: "getConsultarVales",
        codFuncionario,
        dataInicio,
        dataFim,
    });
    return data;
}

export default {
    getDadosParaInputs,
    getConsultarVales

}