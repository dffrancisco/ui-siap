import axios from "axios";
import {
    iParamGetCidades,
    iCidadeResponse,
    iFieldDuplicity,
    iParamToInsert,
    iDiffToUpdate,
    iGetDuplicityResponse
} from "../interfaces";
import { state } from "../cidades";

const caminho = "siap/cidades";

type iGetCidadesFunction = (param: iParamGetCidades) => Promise<iCidadeResponse[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse[]>;
type iToInsertFunction = (param: iParamToInsert) => Promise<void>
type iToUpdateFunction = (diff: iDiffToUpdate) => Promise<void>

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

    state.listaUF = data;

    return state;
};

const getDuplicidade: iGetDuplicityFunction = async ({ value, field }) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field,
    });

    return data;
};

const toDelete = async () => {
    return axios.post(caminho, {
        call: "delete",
        cod_cidade: state.gridPrincipal.dataSource().COD_CIDADE,
    });
};

const toInsert: iToInsertFunction = async (newFields) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields
    });

    return data
};

const toUpdate: iToUpdateFunction = async ({ diff }) => {
    let { data } = await axios.post(caminho, {
        call: "update",
        cod_cidade: state.gridPrincipal.dataSource().COD_CIDADE,
        diff,
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
