import axios from "axios";
import { iCarroCliente, iParamGetCarroCliente, iFieldDuplicity, iGetDuplicityResponse, iParamToInsert, iDiffToUpdate} from "../interfaces";
import { state } from "../carroCliente";

const caminho = "siap/carroCliente";

type iGetCarroClienteFunction = (param: iParamGetCarroCliente) => Promise<iCarroCliente[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse[]>;
type iToInsertFunction = (param: iParamToInsert) => Promise<void>
type iToUpdateFunction = (diff: iDiffToUpdate) => Promise<void>

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

const toDelete = async () => {
    return axios.post(caminho, {
        call: "delete",
        placa: state.gridPrincipal.dataSource().PLACA,
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
        placa: state.gridPrincipal.dataSource().PLACA,
        diff,
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