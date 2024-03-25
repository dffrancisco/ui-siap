import axios from "axios";
import {
  iGetMesEAno,
  iGetDadosParaImpressao,
  iResumoPontosFuncionarioResponse,
  iGetDadosParaImpressaoResponse,
} from "../interface";
import { iEmpresa } from "@/models/interfaces";

const caminho = "siap/gerenciarFolhaPonto";

type iGetEmpresa = () => Promise<iEmpresa[]>
type iGetResumoPontosFuncionarioFunction = (param: iGetMesEAno) => Promise<iResumoPontosFuncionarioResponse>;
type iGetDadosParaImpressaoPDF = (param: iGetDadosParaImpressao) => Promise<iGetDadosParaImpressaoResponse>;

const getResumoPontosFuncionario: iGetResumoPontosFuncionarioFunction = async (param) => {
  let { data } = await axios.post(caminho, {
    call: "getResumoPontosFuncionario",
    param,
  });

  return data;
};

const getEmpresa: iGetEmpresa = async () => {
  let { data } = await axios.post('/empresa', {
    call: "getEmpresa",
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
  getEmpresa,
  getResumoPontosFuncionario,
  getDadosParaImpressao,
};
