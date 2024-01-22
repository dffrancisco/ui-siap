import axios from 'axios';
import {
    iCarroResponse,
    iFieldDuplicity,
    iGetDuplicityResponse,
    iParamGetCarros,
    iParamToInsert,
    iParamToUpdate
} from '../interfaces'

const caminho = "siap/carros"

type iGetCarrosFunction = (param: iParamGetCarros) => Promise<iCarroResponse[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse[]>;
type iToInsertFunction = (param: iParamToInsert) => Promise<void>;
type iToUpdateFuntion = (param: iParamToUpdate) => Promise<void>;

const getCarros: iGetCarrosFunction = async ({ param, offset }) => {
    let { data } = await axios.post(caminho, {
        call: "getCarros",
        offset,
        param
    });
    return data
};

const getMontadoras = async () => {
    let { data } = await axios.post(caminho, {
        call: "getMontadoras",
    });

    return data;
};

const getDuplicidade: iGetDuplicityFunction = async ({ value, field }) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field
    });

    return data
}

const toDelete = async (id_carro) => {
    return axios.post(caminho, {
        call: "delete",
        id_carro: id_carro
    });
};

const toInsert: iToInsertFunction = async (newFields) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields
    });

    return data
};

const toUpdate: iToUpdateFuntion = async (param: any) => {
    let {data} = await axios.post(caminho, {
        call: "update",
        param
    });

    return data
}

export default {
    getCarros,
    getMontadoras,
    getDuplicidade,
    toDelete,
    toInsert,
    toUpdate
}