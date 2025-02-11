import axios from "axios";
import {
    iParamToInsert,
    iParamGetSociedade,
    iSociedadeResponse,
    iParamToUpdate,
    iFieldDuplicity,
    iGetDuplicityResponse,
    iToDeleteResponse,
    iInsertResponse,

} from '../interfaces';

const caminho = "siap/sociedade";

const getSociedades = async ({ param, offset }: iParamGetSociedade): Promise<iSociedadeResponse> => {
    const { data } = await axios.post(caminho, {
        call: "getSociedades",
        offset,
        param,
    });
    return data;
};

const getDuplicidade = async ({ value, field }: iFieldDuplicity): Promise<iGetDuplicityResponse> => {
    const { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field,
    });
    return data;
};

const toInsert = async (newFields: iParamToInsert): Promise<iInsertResponse> => {
    const { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields,
    });
    return data;
};

const toUpdate = async (param: iParamToUpdate) => {
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
