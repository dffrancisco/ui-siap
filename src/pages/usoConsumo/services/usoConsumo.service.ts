import axios from "axios";
import { iParamsUsoConsumo, iDadosUsoConsumo } from "../interfaces";

const caminho = 'taap/usoConsumo';

type iGetDadosUsoConsumo = (param: iParamsUsoConsumo) => Promise<iDadosUsoConsumo[]>;

const getDadosParaRelatorio: iGetDadosUsoConsumo = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaRelatorio",
        param
    });
    return data;
};

export default {
    getDadosParaRelatorio
};
