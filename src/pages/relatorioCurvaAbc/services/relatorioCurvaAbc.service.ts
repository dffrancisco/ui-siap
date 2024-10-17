import axios from "axios";
import { iParams, iResponseDadosInput, iResponseRelatorio } from "../interfaces";

const caminho = 'siap/relatorioCurvaAbc';


type iGetDadosParaInputs = () => Promise<iResponseDadosInput>;
type iGetDadosParaRelatorio = (param: iParams) => Promise<iResponseRelatorio>;


const getDadosParaInputs: iGetDadosParaInputs = async () => {
    try {
        let { data } = await axios.post(caminho, {
            call: "getDadosParaInputs",
        });
        return data;
    } catch (error) {
        console.error("Erro ao buscar dados para inputs", error);
        throw error;
    }
}


const getDadosParaRelatorio: iGetDadosParaRelatorio = async (param) => {
    try {
        let { data } = await axios.post(caminho, {
            call: "getDadosParaRelatorio",
            param
        });
        return data;
    } catch (error) {
        console.error("Erro ao buscar dados para o relatório", error);
        throw error;
    }
}

export default {
    getDadosParaInputs,
    getDadosParaRelatorio
}
