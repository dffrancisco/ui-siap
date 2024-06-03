import axios from "axios";
import { iConversaAberta, iGetMsgsCallbellResponse, iUsuario } from "../interfaces";

type iGetUsuariosFunction = () => Promise<iUsuario[]>
type iGetConversasAbertasFunction = () => Promise<iConversaAberta[]>
type iGetMsgsCallbellFunction = (uuid: string, page: number) => Promise<iGetMsgsCallbellResponse>

const urlServerWhatsapp = "http://localhost:2836"
// const urlServerWhatsapp = "http://181.215.134.232:2836"

const getUsuarios: iGetUsuariosFunction = async () => {
    let { data } = await axios.get(`${urlServerWhatsapp}/usuarios`)
    return data;
}

const getConversasAbertas: iGetConversasAbertasFunction = async () => {
    let { data } = await axios.get(`${urlServerWhatsapp}/conversas-abertas`)
    return data;
}

const getMsgsCallbell: iGetMsgsCallbellFunction = async (uuid, page) => {
    let { data } = await axios.get(`${urlServerWhatsapp}/msgs-callbell?uuid=${uuid}&page=${page}`);
    return data;
}

const fecharConversa = async (uuid: string) => {
    let { data } = await axios.get(`${urlServerWhatsapp}/fechar-conversa?uuid=${uuid}`);
    return data;
}

const formatarTempoEmMinutos = (minutos) => {
    let dias = Math.floor(minutos / (24 * 60));
    let horas = Math.floor((minutos % (24 * 60)) / 60);
    let minutosRestantes = minutos % 60;

    let resultado = '';

    if (dias > 0) {
        resultado += dias + ' dia';
        if (dias > 1) resultado += 's';
    }
    if (horas > 0) {
        if (resultado !== '') resultado += ' ';
        resultado += horas + 'h';
    }
    if (minutosRestantes > 0) {
        if (resultado !== '') resultado += ' ';

        if (minutosRestantes % 1 !== 0) {
            minutosRestantes = Math.round(minutosRestantes);
        }

        resultado += minutosRestantes + 'min';
    }

    return resultado;
}

export default {
    getUsuarios,
    getConversasAbertas,
    formatarTempoEmMinutos,
    getMsgsCallbell,
    fecharConversa
}