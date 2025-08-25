import axios from "axios";
import { iResponseDadosInput, iResponseVales } from "../interfaces";

const caminho = 'taap/consultaValeDinheiro'


type iGetDadosParaInputs = () => Promise<iResponseDadosInput>;

type iGetConsultarVales = (codFuncionario: number[] | null, ano: number) => Promise<iResponseVales[]>;

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}

const getDadosParaRelatorio: iGetConsultarVales = async (codFuncionario, ano) => {
    let { data } = await axios.post(caminho, {
        call: "getConsultarVales",
        codFuncionario,
        ano,
    });
    return data;
}

export default {
    getDadosParaInputs,
    getDadosParaRelatorio
}
