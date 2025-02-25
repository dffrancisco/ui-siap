import axios from "axios";
import {
    iParamsValePeca,
    iResponseOrcamento,
    iParamsItemOrcamento,
    iFuncionario,
} from "../interfaces";

type iGetFuncionarios = () => Promise<iFuncionario[]>
type iConsultarVales = (param: iParamsValePeca) => Promise<any[]>;
type iConsultarValePeca = (param: iParamsValePeca) => Promise<iParamsValePeca[]>;
type iGetOrcamento = () => Promise<iResponseOrcamento[]>;
type iGetItensOrcamento = () => Promise<iParamsItemOrcamento[]>;


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

const getOrcamento: iGetOrcamento = async () => {
    const { data } = await axios.post(caminho, {
        call: "getOrcamento",

    });
    return data;
};

const getItensOrcamento: iGetItensOrcamento = async () => {
    const { data } = await axios.post(caminho, {
        call: "getItensOrcamento",

    });
    return data;
};



export default {
    consultarVales,
    getconsultarValePeca,
    getOrcamento,
    getItensOrcamento,
    getFuncionarios
};
