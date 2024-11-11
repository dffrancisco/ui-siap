import axios from "axios";
import { iParamsParaRelatorio, iResponseDadosEntregarReceber } from "../interfaces";

const caminho = 'siap/relatorioEntregarReceber';

type iGetDadosEntregarReceber = (param: iParamsParaRelatorio) => Promise<iResponseDadosEntregarReceber>;


const getDadosParaRelatorio: iGetDadosEntregarReceber = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaRelatorio",
        param
    });
    return data;
}

export default {
    getDadosParaRelatorio
}
