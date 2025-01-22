import axios from "axios";
import { iTransportadora, iParamsRelatorioConhecimento, iRelatorioConhecimento } from "../interfaces";

const caminho = 'siap/relatorioDeConhecimento';

type iGetDadosParaRelatorio = (param: iParamsRelatorioConhecimento) => Promise<iRelatorioConhecimento[]>;
type iGetTransportadora = () => Promise<iTransportadora[]>;


const getRelatorioConhecimento: iGetDadosParaRelatorio = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getRelatorioConhecimento",
        param,
    });
    return data;
};

const getTransportadora: iGetTransportadora = async () => {
    const { data } = await axios.post(caminho, {
        call: "getTransportadoras",
    });
    return data;
}


export default {
    getRelatorioConhecimento,
    getTransportadora,
};
