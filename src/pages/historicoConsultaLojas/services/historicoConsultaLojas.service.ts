import axios from "axios";
import { iHistoricoConsultaLojas, iParams } from "../interfaces";

const caminho = 'siap/historicoConsultaLojas'

type iGetHistoricoConsultaLojasFunction = (param: iParams) => Promise<iHistoricoConsultaLojas>;

const getHistoricoConsultaLojas: iGetHistoricoConsultaLojasFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getHistoricoConsultaLojas",
        param
    });
    return data;
}


export default {
    getHistoricoConsultaLojas,
}