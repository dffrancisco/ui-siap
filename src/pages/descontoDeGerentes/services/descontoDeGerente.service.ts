import axios from "axios";

import {
    iGetUsuariosResponse,
    iGetUsuariosComPermissaoResponse,
    iParamDarPermissao,
    iDarPermissaoResponse,
    iParamAlterarSenha,
    iAlterarSenhaResponse,
    iParamRemoverPermissao,
    iRemoverPermissaoResponse
} from "../interfaces";

const caminho = 'siap/descontoGerentes';

const getUsuarios = async (): Promise<iGetUsuariosResponse> => {
    let { data } = await axios.post(caminho, {
        call: "getUsuarios"
    });
    return data;
};

const getUsuariosComPermissao = async (): Promise<iGetUsuariosComPermissaoResponse> => {
    let { data } = await axios.post(caminho, {
        call: "getUsuariosComPermissao"
    });
    return data;
};

const darPermissao = async (param: iParamDarPermissao): Promise<iDarPermissaoResponse> => {
    let { data } = await axios.post(caminho, {
        call: "darPermissao",
        param
    });
    return data;
};

const alterarSenha = async (param: iParamAlterarSenha): Promise<iAlterarSenhaResponse> => {
    let { data } = await axios.post(caminho, {
        call: "alterarSenha",
        param
    });
    return data;
};

const removerPermissao = async (param: iParamRemoverPermissao): Promise<iRemoverPermissaoResponse> => {
    let { data } = await axios.post(caminho, {
        call: "removerPermissao",
        param
    });
    return data;
};

export default {
    getUsuarios,
    getUsuariosComPermissao,
    darPermissao,
    alterarSenha,
    removerPermissao
};
