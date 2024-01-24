import axios from "axios";
import {
    iParamGetTransportadoras, iGetTransportadorasResponse, iFieldDuplicity, iGetDuplicityResponse,
    iGetInsertResponse, iParamToInsert
} from "../interfaces";

const caminho = 'siap/transportadoras';

type iGetTransportadorasFunction = (param: iParamGetTransportadoras) => Promise<iGetTransportadorasResponse>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iGetInsertResponse>;

const getTransportadoras: iGetTransportadorasFunction = async ({ param, offset }) => {
    let { data } = await axios.post(caminho, {
        call: "getTransportadoras",
        offset,
        param
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

export default {
    getTransportadoras,
    getCidades,
    getDuplicidade,
    toInsert
}