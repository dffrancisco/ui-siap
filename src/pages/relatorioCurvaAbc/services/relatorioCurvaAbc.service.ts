import axios from "axios";
import { iMarcas, iParams, iResponseRelatorio } from "../interfaces";

const caminho = 'siap/relatorioCurvaAbc';



type iGetDadosParaRelatorio = (param: iParams) => Promise<iResponseRelatorio>;
type iGetMarcas = () => Promise<iMarcas[]>;


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
    getDadosParaRelatorio,
    getMarcas,
};
