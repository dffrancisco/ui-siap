import axios from "axios";
import { iGetHistoricoConsultaLojasResponse, iMesEAno } from "../interfaces";

const caminho = 'siap/historicoConsultaLojas'

type iGetHistoricoConsultaLojasFunction = (param: iMesEAno) => Promise<iGetHistoricoConsultaLojasResponse[]>;

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