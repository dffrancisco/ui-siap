import axios from "axios";
import { iParamsUsoConsumo, iResponseUsoConsumo } from "../interfaces";

const caminho = 'siap/usoConsumo';

type iGetDadosParaRelatorio = (param: iParamsUsoConsumo) => Promise<iResponseUsoConsumo>;

const getDadosParaRelatorio: iGetDadosParaRelatorio = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaRelatorio",
        param
    });
    return data;
};

export default {
    getDadosParaRelatorio
};
