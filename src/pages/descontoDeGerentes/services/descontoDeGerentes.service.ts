import axios from "axios";

import {
    iGetUsuariosResponse,
    iParamDarPermissao,
    iDarPermissaoResponse,
    iParamAlterarSenha,
    iAlterarSenhaResponse,
    iParamRemoverPermissao,
    iRemoverPermissaoResponse
} from "../interfaces";

const caminho = 'siap/descontoDeGerentes';

const getInicial = async (): Promise<iGetUsuariosResponse> => {
    let { data } = await axios.post(caminho, {
        call: "getInicial"
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
    getInicial,
    darPermissao,
    alterarSenha,
    removerPermissao
};
