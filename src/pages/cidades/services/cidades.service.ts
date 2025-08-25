import axios from "axios";
import {
    iParamGetCidades,
    iCidadeResponse,
    iFieldDuplicity,
    iParamToInsert,
    iParamToUpdate,
    iGetDuplicityResponse,
    iInsertResponse
} from "../interfaces";

const caminho = "taap/cidades";

type iGetCidadesFunction = (param: iParamGetCidades) => Promise<iCidadeResponse>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iInsertResponse>
type iToUpdateFunction = (param: iParamToUpdate) => Promise<void>

const getCidades: iGetCidadesFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: "getCidades",
        offset,
        param,
    });
    return data;
};

const getUF = async () => {
    let { data } = await axios.post(caminho, {
        call: "getUF",
    });

    return data
};

const getDuplicidade: iGetDuplicityFunction = async ({ value, field }) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field,
    });

    return data;
};

const toDelete = async (cod_cidade) => {
    return axios.post(caminho, {
        call: "delete",
        cod_cidade: cod_cidade,
    });
};

const toInsert: iToInsertFunction = async (newFields) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields
    });

    return data
};

const toUpdate: iToUpdateFunction = async (param: any) => {
    let { data } = await axios.post(caminho, {
        call: "update",
        param
    });

    return data
}

export default {
    getCidades,
    getUF,
    getDuplicidade,
    toDelete,
    toInsert,
    toUpdate
};
