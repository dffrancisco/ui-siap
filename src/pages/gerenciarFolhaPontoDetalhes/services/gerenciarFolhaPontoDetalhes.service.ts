import axios from "axios";
import { iParam, iParamComCPF } from "../interface";
const caminho = "siap/gerenciarFolhaPonto";

type iGetPontosFunction = (param: iParamComCPF) => Promise<object>;
type iGetResumoPontosFuncionario = (param: iParam) => Promise<object>;
type iGetTipoFaltas = (param: iParam) => Promise<object>;

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

export default {
  getPontos,
  getResumoPontosFuncionario,
  getTipoFaltas,
};
