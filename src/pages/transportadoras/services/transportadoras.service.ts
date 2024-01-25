import axios from "axios";
import {
    iParamGetTransportadoras, iGetTransportadorasResponse, iFieldDuplicity, iGetDuplicityResponse,
    iGetInsertResponse, iParamToInsert, iParamToUpdate
} from "../interfaces";

const caminho = 'siap/transportadoras';

type iGetTransportadorasFunction = (param: iParamGetTransportadoras) => Promise<iGetTransportadorasResponse>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iGetInsertResponse>;
type iToUpdateFuntion = (param: iParamToUpdate) => Promise<void>;

const getTransportadoras: iGetTransportadorasFunction = async ({ param, offset, checkboxAtiva }) => {
    let { data } = await axios.post(caminho, {
        call: "getTransportadoras",
        offset,
        param,
        checkboxAtiva
    });

    return data;
};

const getCidades = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCidades"
    })

    return data;
}

const getDuplicidade: iGetDuplicityFunction = async ({ value, field }) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field
    });

    return data;
}

const toInsert: iToInsertFunction = async (newFields) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields
    });

    return data;
}

const toUpdate: iToUpdateFuntion = async (param: object) => {
    let { data } = await axios.post(caminho, {
        call: "update",
        param
    });

    return data;
}

const toInativar = async (ID_TRANSPORTADORA:number, DELETADO: string | null) => {
    return axios.post(caminho, {
        call: "inativar",
        ID_TRANSPORTADORA: ID_TRANSPORTADORA,
        DELETADO: DELETADO
    })
}

const buscarCEP = async (cep: string) => {
    let data = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    return data;
}

export default {
    getTransportadoras,
    getCidades,
    getDuplicidade,
    toInsert,
    toUpdate,
    toInativar,
    buscarCEP
}