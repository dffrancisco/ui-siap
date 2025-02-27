import axios from "axios";
import {
    iParamsValePeca,
    iResponseOrcamento,
    iParamsItemOrcamento,
    iFuncionario,
} from "../interfaces";

type iGetFuncionarios = () => Promise<iFuncionario[]>
type iConsultarVales = (param: iParamsValePeca) => Promise<iParamsValePeca[]>;
type iConsultarValePeca = (param: iParamsValePeca) => Promise<iParamsValePeca[]>;
type iGetOrcamento = (param: { num_Orcamento: number, data: Date }) => Promise<iResponseOrcamento[]>;
type iGetItensOrcamento = (param: { num_Orcamento: number, data: Date }) => Promise<iParamsItemOrcamento[]>;


const caminho = "siap/consultaValePecas";

const getFuncionarios: iGetFuncionarios = async () => {
    let { data } = await axios.post(caminho, {
        call: "getFuncionarios",
    });

    return data;
}

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
    const { data: response } = await axios.post(caminho, {
        call: "getOrcamento",
        param
    });
    return response;
};

const getItensOrcamento: iGetItensOrcamento = async (param) => {
    const { data: response } = await axios.post(caminho, {
        call: "getItensOrcamento",
        param
    });
    return response;
};



export default {
    consultarVales,
    getconsultarValePeca,
    getOrcamento,
    getItensOrcamento,
    getFuncionarios
};
