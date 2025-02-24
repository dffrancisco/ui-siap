import axios from "axios";
import {
    iParamsValePeca,
    iResponseVale,
    iResponseOrcamento,
    iParamsItemOrcamento
} from "../interfaces";

type iConsultarVales = (param: string) => Promise<iResponseVale[]>;
type iConsultarValePeca = (param: string) => Promise<iParamsValePeca[]>;
type iGetOrcamento = (param: string) => Promise<iResponseOrcamento[]>;
type iGetItensOrcamento = (param: string) => Promise<iParamsItemOrcamento[]>;

const caminho = 'siap/vale-peca';

const consultarVales: iConsultarVales = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getConsultarVales",
        param
    });
    return data;
};

const getconsultarValePeca: iConsultarValePeca = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getConsultarValePeca",
        param
    });
    return data;
};

const getOrcamento: iGetOrcamento = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getOrcamento",
        param
    });
    return data;
};

const getItensOrcamento: iGetItensOrcamento = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getItensOrcamento",
        param
    });
    return data;
};

export default {
    consultarVales,
    getconsultarValePeca,
    getOrcamento,
    getItensOrcamento
};