import axios from "axios";
import { iMarcas, iParamDadosParaRelatorio, iResponseRelatorio } from "../interfaces";

const caminho = 'siap/relatorioCurvaAbc';



type iGetDadosParaRelatorio = (param: iParamDadosParaRelatorio) => Promise<iResponseRelatorio>;
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
