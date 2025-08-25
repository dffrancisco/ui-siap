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
type iGetOrcamentoCompleto = (param: { num_Orcamento: number, data: Date }) => Promise<{
    cabecalho: iResponseOrcamento,
    itens: iParamsItemOrcamento[]
}>;

const caminho = "taap/consultaValePecas";

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

const getOrcamentoCompleto: iGetOrcamentoCompleto = async (param) => {
    const ajusteParam = {
        num_Orcamento: Number(param.num_Orcamento),
        data: param.data
    };

    const { data } = await axios.post(caminho, {
        call: "getOrcamentoCompleto",
        param: ajusteParam
    });
    return data;
};

export default {
    consultarVales,
    getconsultarValePeca,
    getOrcamentoCompleto,
    getFuncionarios
};
