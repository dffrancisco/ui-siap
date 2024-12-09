import axios from "axios";
import { iGetChamadosResponse, iInsertChamado, iInsertChamadoResponse, iParamGetChamados, iVerDetalhesChamadoResponse } from "../interfaces";

type iGetChamadosFunction = (param: iParamGetChamados) => Promise<iGetChamadosResponse>
type iVerDetalhesChamadoFunction = (keyJira: string) => Promise<iVerDetalhesChamadoResponse>
type iInsertChamadoFunction = (param: iInsertChamado) => Promise<iInsertChamadoResponse>

const getChamados: iGetChamadosFunction = async ({ page, itemsPerPage, sortBy, search }) => {
    let { data } = await axios.post('siap/chamados', {
        call: 'getChamados',
        param: {
            page,
            itemsPerPage,
            sortBy,
            search,
        }
    });

    return data;
}

const verDetalhesChamado: iVerDetalhesChamadoFunction = async (keyJira) => {
    let { data } = await axios.post('siap/chamados', {
        call: 'verDetalhesChamado',
        param: {
            keyJira,
        },
    });
    return data;
}

const insertChamado: iInsertChamadoFunction = async (param) => {
    let { data } = await axios.post('siap/chamados', {
        call: 'insert',
        param
    });
    return data;
}

const uploadAnexos = async (formData) => {
    const response = await fetch("http://www.reallatas.com.br/chamados/getFilesChamados.php", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Erro na requisição.");
    }

    const result = await response.json();
    return result;
}

const getImgChamado = async (param) => {
    let { data } = await axios.post('http://www.reallatas.com.br/chamados/getFilesChamados.php', {
        call: 'getImgChamado',
        cnpj: param.cnpj,
        id_chamado: param.keyJira,
    });
    return data;
};


const updateChamado = async (param) => {
    let { data } = await axios.post('siap/chamados', {
        call: 'updateChamado',
        param
    });
    return data;
}

const enviarComentario = async (param) => {
    let { data } = await axios.post('siap/chamados', {
        call: 'enviarComentario',
        param
    });
    return data;
}

const removerImagemChamado = async (param) => {
    let { data } = await axios.post('http://www.reallatas.com.br/chamados/getFilesChamados.php', {
        call: 'removerImagemChamado',
        nomeImagem: param.nomeImagem,
        cnpj: param.cnpj
    });
    return data;
}

export default {
    getChamados,
    verDetalhesChamado,
    insertChamado,
    updateChamado,
    getImgChamado,
    uploadAnexos,
    enviarComentario,
    removerImagemChamado
}