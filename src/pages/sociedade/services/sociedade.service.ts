import axios from "axios";
import {
    iParamToInsert,
    iParamGetSociedade,
    iSociedade,
    iParamToUpdate,
    iFieldDuplicity,
    iGetDuplicityResponse,
    iToDeleteResponse,
    iInsertResponse,

} from '../interfaces';

const caminho = "siap/sociedade";

type iGetSociedadeFunction = (param: iParamGetSociedade) => Promise<iSociedade[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iInsertResponse>;
type iToUpdateFunction = (param: iParamToUpdate) => Promise<void>;

const getSociedades: iGetSociedadeFunction = async ({ param, offset }) => {
    const { data } = await axios.post(caminho, {
        call: "getSociedades",
        offset,
        param,
    });
    return data;
};

const getDuplicidade: iGetDuplicityFunction = async ({ value, field }) => {
    const { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field,
    });
    return data;
};

const toInsert: iToInsertFunction = async (newFields) => {
    const { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields,
    });
    return data;
};

const toUpdate: iToUpdateFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "update",
        param,
    });
    return data;
};

const toDelete = async (id_sociedade: number): Promise<iToDeleteResponse> => {
    const { data } = await axios.post(caminho, {
        call: "delete",
        id_sociedade,
    });
    return data;
};

export default {
    getSociedades,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete,
};
