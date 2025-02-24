import axios from "axios";
import {
    iParamsValePeca,
    iResponseVale,
    iResponseOrcamento,
    iParamsItemOrcamento,
} from "../interfaces";


type iConsultarVales = (param: iResponseVale) => Promise<iResponseVale[]>;
type iConsultarValePeca = (param: iParamsValePeca) => Promise<iParamsValePeca[]>;
type iGetOrcamento = (param: iResponseOrcamento) => Promise<iResponseOrcamento[]>;
type iGetItensOrcamento = (param: iParamsItemOrcamento) => Promise<iParamsItemOrcamento[]>;

const caminho = "siap/vale-peca";

const consultarVales: iConsultarVales = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getConsultarVales",
        param,
    });
    return data;
};

const getconsultarValePeca: iConsultarValePeca = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getConsultarValePeca",
        param,
    });
    return data;
};

const getOrcamento: iGetOrcamento = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getOrcamento",
        param,
    });
    return data;
};

const getItensOrcamento: iGetItensOrcamento = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getItensOrcamento",
        param,
    });
    return data;
};

export default {
    consultarVales,
    getconsultarValePeca,
    getOrcamento,
    getItensOrcamento,
};
