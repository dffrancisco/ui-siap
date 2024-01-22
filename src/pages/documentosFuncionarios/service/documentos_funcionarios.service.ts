import axios from "axios";
import {
    iDocumentosFuncionariosResponse,
    iParamGetDocumentosFuncionarios,
    iFieldDuplicity,
    iGetDuplicityResponse,
    iParamToInsert,
    iParamToUpdate,
} from '../interfaces'

const caminho = "siap/documentosFuncionarios";

type iGetDocumentosFuncionarios = (param: iParamGetDocumentosFuncionarios) => Promise<iDocumentosFuncionariosResponse[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse[]>;
type iToInsertFunction = (param: iParamToInsert) => Promise<void>
type iToUpdateFunction = (param: iParamToUpdate) => Promise<void>

const getDocumentosFuncionarios: iGetDocumentosFuncionarios = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: "getDocumentosFuncionarios",
        offset,
        param,
    });
    return data;
};

const getDuplicidade: iGetDuplicityFunction = async ({ value, field }) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field,
    });

    return data;
};

const toInsert: iToInsertFunction = async (newFields) => {
    let {data} = await axios.post(caminho, {
        call: "insert",
        param: newFields
    });

    return data;
};

const toUpdate: iToUpdateFunction = async (param:any) => {
    let {data} = await axios.post(caminho, {
        call: "update",
        param
    });

    return data;
}

const toDelete = async (id) => {
    let {data} = await axios.post(caminho, {
        call: "delete",
        id: id
    });

    return data;
}

export default{
    getDocumentosFuncionarios,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete
}
