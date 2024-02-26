import axios from "axios";
import { iGetMesEAno, iGetDadosParaImpressao } from "../interface";

const caminho = "siap/gerenciarFolhaPonto";

type iGetFuncionariosFunction = (param: iGetMesEAno) => Promise<object>;
type iGetDadosParaImpressaoPDF = (param: iGetDadosParaImpressao) => Promise<object>;

const getFuncionarios: iGetFuncionariosFunction = async (param) => {
  let { data } = await axios.post(caminho, {
    call: "getFuncionarios",
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
  getFuncionarios,
  getDadosParaImpressao,
};
