import axios from "axios";
import { iCarroCliente, iParamGetCarroCliente, iFieldDuplicity, iGetDuplicityResponse, iParamToInsert, iParamToUpdate} from "../interfaces";
import { state } from "../carroCliente";

const caminho = "siap/carroCliente";

type iGetCarroClienteFunction = (param: iParamGetCarroCliente) => Promise<iCarroCliente[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse[]>;
type iToInsertFunction = (param: iParamToInsert) => Promise<void>
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

    state.listaModelos = data

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

const toUpdate: iToUpdateFunction = async (param:any, id: any) => {
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