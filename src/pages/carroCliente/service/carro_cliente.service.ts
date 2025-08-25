import axios from "axios";
import {
    iCarroClienteResponse, iParamGetCarroCliente, iFieldDuplicity, iGetDuplicityResponse, iParamToInsert
    , iParamToUpdate, iGetInsertResponse
} from "../interfaces";

const caminho = "taap/carroCliente";

type iGetCarroClienteFunction = (param: iParamGetCarroCliente) => Promise<iCarroClienteResponse>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iGetInsertResponse>
type iToUpdateFunction = (param: iParamToUpdate, id: any) => Promise<void>

const getCarroCliente: iGetCarroClienteFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: "getCarroCliente",
        offset,
        param,
    });
    return data;
};

const getModelos = async () => {
    let { data } = await axios.post(caminho, {
        call: "getModelos",
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

const toDelete = async (placa) => {
    return axios.post(caminho, {
        call: "delete",
        placa: placa
    });
};

const toInsert: iToInsertFunction = async (newFields) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields
    });

    return data
};

const toUpdate: iToUpdateFunction = async (param: any, id: any) => {
    let { data } = await axios.post(caminho, {
        call: "update",
        param,
        id
    });

    return data
}

export default {
    getCarroCliente,
    getModelos,
    getDuplicidade,
    toDelete,
    toInsert,
    toUpdate
}