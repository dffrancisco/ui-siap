import axios from "axios";
import {
    iDadosDocumento,
    iDeletarArquivo,
    iDeletarDocumento,
    iDeletarFalta,
    iDeleteArquivoResponse,
    iDeleteDocumentoResponse,
    iDeleteFaltaResponse,
    iFaltaFeriadoFolga,
    iGetDadosParaImpressaoIndividual,
    iGetDadosParaImpressaoPDFResponse,
    iGetDetalhes,
    iGetDetalhesResponse,
    iInserirRegistroAusenciaResponse,
    iParamDocumentoAusencia,
    iRegistrarDocumentoAusencia,
    iRegistrarFalta,
    iSetFaltaResponse,
    iSetFeriadoFolgaResponse,
} from "../interface";
const caminho = "siap/gerenciarFolhaPonto";

type igetDetalhes = (param: iGetDetalhes) => Promise<iGetDetalhesResponse>;
type iSetFeriadoFolga = (param: iFaltaFeriadoFolga) => Promise<iSetFeriadoFolgaResponse>;
type iSetFalta = (param: iRegistrarFalta) => Promise<iSetFaltaResponse>;
type iDeleteFalta = (param: iDeletarFalta) => Promise<iDeleteFaltaResponse>;
type iDeleteDocumento = (param: iDeletarDocumento) => Promise<iDeleteDocumentoResponse>;
type iDeleteArquivo = (param: iDeletarArquivo) => Promise<iDeleteArquivoResponse>;
type iInserirRegistroAusencia = (param: iRegistrarDocumentoAusencia) => Promise<iInserirRegistroAusenciaResponse>;
type iGetDocumentoAusencia = (param: iParamDocumentoAusencia) => Promise<iDadosDocumento[]>;
type iGetDadosParaImpressaoPDF = (
    param: iGetDadosParaImpressaoIndividual
) => Promise<iGetDadosParaImpressaoPDFResponse>;

const getDetalhes: igetDetalhes = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDetalhes",
        param,
    });
    return data;
};

const setFaltaFeriadoOuFolga: iSetFeriadoFolga = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "setFaltaFeriadoOuFolga",
        param,
    });

    return data;
};

const setFalta: iSetFalta = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "setFalta",
        param,
    });

    return data;
};

const deletarFalta: iDeleteFalta = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deletarFalta",
        param,
    });

    return data;
};

const deletarDocumento: iDeleteDocumento = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deletarDocumento",
        param,
    });

    return data;
};

const deletarArquivo: iDeleteArquivo = async (param) => {
    return $.ajax({
        url: "http://reallatas.com.br/doc_funcionario/getFiles.php",
        type: "POST",
        dataType: "json",
        data: {
            call: "deleteArquivo",
            class: "Files",
            param: {
                cpf: param.cpf,
                folderName: param.folderName,
                nomeArquivo: param.file_name,
                usuario: param.usuario,
            },
        },
    });
};

const uploadPDF = async (formData) => {
    const rs = await $.ajax({
        url: "http://www.reallatas.com.br/doc_funcionario/getFiles.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
    });
    return rs;
};

const verificarArquivos = async (cpf) => {
    const rs = await $.ajax({
        url: "https://reallatas.com.br/doc_funcionario/getFiles.php",
        type: "POST",
        dataType: "json",
        data: {
            class: "Files",
            call: "getFilesTemp",
            param: {
                cpf: cpf,
                pasta: "ausencia",
            },
        },
    });
    return rs;
};

const moverArquivoTemp = async (tipoDocumento, cpf) => {
    const rs = await $.ajax({
        url: "https://reallatas.com.br/doc_funcionario/getFiles.php",
        type: "POST",
        dataType: "json",
        data: {
            class: "Files",
            call: "moverArquivoTemp",
            param: {
                cpf: cpf,
                pasta: tipoDocumento,
            },
        },
    });
    return rs;
};

const createRegistroDocumento: iInserirRegistroAusencia = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "createRegistroDocumento",
        param,
    });

    return data;
};

const getDocumentoAusencia: iGetDocumentoAusencia = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDocumentoAusencia",
        param,
    });

    return data;
};

const getDadosParaImpressao: iGetDadosParaImpressaoPDF = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaImpressao",
        param,
    });

    return data;
};

export default {
    getDetalhes,
    setFaltaFeriadoOuFolga,
    deletarFalta,
    deletarDocumento,
    deletarArquivo,
    createRegistroDocumento,
    setFalta,
    getDocumentoAusencia,
    uploadPDF,
    verificarArquivos,
    moverArquivoTemp,
    getDadosParaImpressao,
};
