import axios from "axios";
import { iMarcas, iParams, iResponseDadosInput, iResponseRelatorio } from "../interfaces";

const caminho = 'siap/relatorioCurvaAbc';


type iGetDadosParaInputs = () => Promise<iResponseDadosInput>;
type iGetDadosParaRelatorio = (param: iParams) => Promise<iResponseRelatorio>;
type iGetMarcas = () => Promise<iMarcas[]>;


const getDadosParaInputs: iGetDadosParaInputs = async () => {
    const { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}

const getDadosParaRelatorio: iGetDadosParaRelatorio = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getDadosParaRelatorio",
        param,
    });
    return data;
};


const getMarcas: iGetMarcas = async () => {
    const { data } = await axios.post(caminho, {
        call: "getMarcas",
    });
    return data;
}


export default {
    getDadosParaInputs,
    getDadosParaRelatorio,
    getMarcas,
};
