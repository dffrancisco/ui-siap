import axios from "axios";
import {
  iCodFunc,
  iDadosDocumento,
  iDeletarArquivo,
  iDeletarFaltaEDocumento,
  iFaltaFeriadoFolga,
  iParam,
  iParamComCPF,
  iParamDocumentoAusencia,
  iRegistrarDocumentoAusencia,
  iRegistrarFalta,
} from "../interface";
const caminho = "siap/gerenciarFolhaPonto";

type iGetPontosFunction = (param: iParamComCPF) => Promise<object>;
type iGetResumoPontosFuncionario = (param: iParam) => Promise<object>;
type iGetTipoFaltas = (param: iParam) => Promise<object>;
type iGetDadosFuncionario = (param: iCodFunc) => Promise<object>;
type iSetFeriadoFolga = (param: iFaltaFeriadoFolga) => Promise<object>;
type iSetFalta = (param: iRegistrarFalta) => Promise<object>;
type iDeleteFalta = (param: iDeletarFaltaEDocumento) => Promise<object>;
type iDeleteArquivo = (param: iDeletarArquivo) => Promise<object>;
type iInserirRegistroAusencia = (param: iRegistrarDocumentoAusencia) => Promise<object>;
type iGetDocumentoAusencia = (param: iParamDocumentoAusencia) => Promise<iDadosDocumento[]>;

const getDadosFuncionario: iGetDadosFuncionario = async (param) => {
  let { data } = await axios.post(caminho, {
    call: "getDadosFuncionario",
    param,
  });
  return data;
};

const getPontos: iGetPontosFunction = async (param) => {
  let { data } = await axios.post(caminho, {
    call: "getPontos",
    param,
  });

  return data;
};

const getResumoPontosFuncionario: iGetResumoPontosFuncionario = async (param) => {
  let { data } = await axios.post(caminho, {
    call: "getResumoPontosFuncionario",
    param,
  });

  return data;
};

const getTipoFaltas: iGetTipoFaltas = async (param) => {
  let { data } = await axios.post(caminho, {
    call: "getTipoFaltas",
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

const deletarFaltaEDocumento: iDeleteFalta = async (param) => {
  let { data } = await axios.post(caminho, {
    call: "deletarFaltaEDocumento",
    param,
  });

  return data;
};

const deletarArquivo: iDeleteArquivo = async (param) => {
  return $.ajax({
    url: "https://reallatas.com.br/doc_funcionario/getFiles.php",
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
  try {
    const rs = await $.ajax({
      url: "http://www.reallatas.com.br/doc_funcionario/getFiles.php",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
    });
    return rs;
  } catch (error) {
    throw error;
  }
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

export default {
  getDadosFuncionario,
  getPontos,
  getResumoPontosFuncionario,
  getTipoFaltas,
  setFaltaFeriadoOuFolga,
  deletarFaltaEDocumento,
  deletarArquivo,
  createRegistroDocumento,
  setFalta,
  getDocumentoAusencia,
  uploadPDF,
};
