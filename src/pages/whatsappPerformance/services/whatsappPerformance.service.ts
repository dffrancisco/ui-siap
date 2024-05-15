import axios from "axios";
import { iAtendimentoIniciado, iAtendimentoFinalizado } from "../interfaces";

type iGetRelatorioAtendimentosIniciadosFunction = (dataInicio: string, dataFim: string) => Promise<iAtendimentoIniciado[]>
type iGetRelatorioAtendimentosFinalizadosFunction = (dataInicio: string, dataFim: string) => Promise<iAtendimentoFinalizado[]>

const urlServerWhatsapp = "http://localhost:2836"
// const urlServerWhatsapp = "http://181.215.134.232:2836"

const getRelatorioAtendimentosIniciados: iGetRelatorioAtendimentosIniciadosFunction = async (dataInicio, dataFim) => {
    let { data } = await axios.get(`${urlServerWhatsapp}/relatorio-atendimentos-iniciados?dataInicio=${dataInicio}&dataFim=${dataFim}`)
    return data;
}

const getRelatorioAtendimentosFinalizados: iGetRelatorioAtendimentosFinalizadosFunction = async (dataInicio, dataFim) => {
    let { data } = await axios.get(`${urlServerWhatsapp}/relatorio-atendimentos-finalizados?dataInicio=${dataInicio}&dataFim=${dataFim}`);
    return data;
}

export default {
    getRelatorioAtendimentosIniciados,
    getRelatorioAtendimentosFinalizados
}