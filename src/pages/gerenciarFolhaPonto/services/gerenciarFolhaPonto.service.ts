import axios from "axios";
import {
  iGetMesEAno,
  iGetDadosParaImpressao,
  iResumoPontosFuncionarioResponse,
  iGetDadosParaImpressaoResponse,
} from "../interface";

const caminho = "siap/gerenciarFolhaPonto";

type iGetResumoPontosFuncionarioFunction = (param: iGetMesEAno) => Promise<iResumoPontosFuncionarioResponse>;
type iGetDadosParaImpressaoPDF = (param: iGetDadosParaImpressao) => Promise<iGetDadosParaImpressaoResponse>;

const getResumoPontosFuncionario: iGetResumoPontosFuncionarioFunction = async (param) => {
  let { data } = await axios.post(caminho, {
    call: "getResumoPontosFuncionario",
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
  getResumoPontosFuncionario,
  getDadosParaImpressao,
};
