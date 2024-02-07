import axios from "axios";
import { iCodFunc, iFaltaFeriadoFolga, iParam, iParamComCPF } from "../interface";
const caminho = "siap/gerenciarFolhaPonto";

type iGetPontosFunction = (param: iParamComCPF) => Promise<object>;
type iGetResumoPontosFuncionario = (param: iParam) => Promise<object>;
type iGetTipoFaltas = (param: iParam) => Promise<object>;
type iGetDadosFuncionario = (param: iCodFunc) => Promise<object>;
type iSetFeriadoFolga = (param: iFaltaFeriadoFolga) => Promise<object>;

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

export default {
  getDadosFuncionario,
  getPontos,
  getResumoPontosFuncionario,
  getTipoFaltas,
  setFaltaFeriadoOuFolga,
};
