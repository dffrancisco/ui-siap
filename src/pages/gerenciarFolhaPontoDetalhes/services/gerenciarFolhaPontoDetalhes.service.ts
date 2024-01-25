import axios from "axios";
import { iParam } from "../interface";
const caminho = "siap/gerenciarFolhaPonto";

type iGetFaltasFunction = (param: iParam) => Promise<object>;
type iGetResumoPontosFuncionario = (param: iParam) => Promise<object>;

const getPontos: iGetFaltasFunction = async (param) => {
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

export default {
  getPontos,
  getResumoPontosFuncionario,
};
