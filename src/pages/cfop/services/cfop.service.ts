import axios from "axios";
import {
    iParamToInsertCfop,
    iParamGetCfop,
    iCfopResponse,
    iParamToUpdateCfop,
    iFieldDuplicity,
    iGetDuplicityResponse,
    iToDeleteResponse,
    iInsertResponse
} from "../interfaces";

const caminho = "siap/cfop";

const getCfop = async ({ param, offset }: iParamGetCfop): Promise<iCfopResponse> => {
    const { data } = await axios.post(caminho, {
        call: "getCfop",
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

const toInsert = async (newFields: iParamToInsertCfop): Promise<iInsertResponse> => {
    const { data } = await axios.post(caminho, {
        call: "insertCfop",
        param: newFields,
    });
    return data;
};

const toUpdate = async (param: iParamToUpdateCfop) => {
    const { data } = await axios.post(caminho, {
        call: "updateCfop",
        param,
    });
    return data;
};

const toDelete = async (cfop: string): Promise<iToDeleteResponse> => {
    const { data } = await axios.post(caminho, {
        call: "deleteCfop",
        cfop,
    });
    return data;
};

export default {
    getCfop,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete,
};
