import axios from "axios";
import {
    iReativarNotificacaoResponse,
    iGetNotificacoesResponse,
    iInativarNotificacaoResponse,
    iInsertNotificacaoResponse,
    iParamInsertNotificacao,
    iParamUpdateNotificacao,
    iQueryGetNotificacoes,
    iUpdateNotificacaoResponse
} from "../intefaces";

const caminho = "siap/notificacoes";

type iGetNotificacoesFunction = ({ offset, param }: iQueryGetNotificacoes) => Promise<iGetNotificacoesResponse>;
type iInsertNotificacaoFunction = (param: iParamInsertNotificacao) => Promise<iInsertNotificacaoResponse[]>;
type iUpdateNotificacaoFunction = (param: iParamUpdateNotificacao) => Promise<iUpdateNotificacaoResponse>;
type iInativarNotificacaoFunction = (id_notificacao: number) => Promise<iInativarNotificacaoResponse>;
type iReativarNotificacaoFunction = (id_notificacao: number) => Promise<iReativarNotificacaoResponse>;

const getNotificacoes: iGetNotificacoesFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: "getNotificacoes",
        offset,
        param
    });

    return data;
}

const insertNotificacao: iInsertNotificacaoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertNotificacao",
        param
    });
    return data;
}

const updateNotificacao: iUpdateNotificacaoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "updateNotificacao",
        param
    });
    return data;
}

const inativarNotificacao: iInativarNotificacaoFunction = async (id_notificacao) => {
    let { data } = await axios.post(caminho, {
        call: "inativarNotificacao",
        id_notificacao: id_notificacao
    });
    return data;
}

const reativarNotificacao: iReativarNotificacaoFunction = async (id_notificacao) => {
    let { data } = await axios.post(caminho, {
        call: "reativarNotificacao",
        id_notificacao: id_notificacao
    });
    return data;
}

export default {
    getNotificacoes,
    insertNotificacao,
    updateNotificacao,
    inativarNotificacao,
    reativarNotificacao,
}