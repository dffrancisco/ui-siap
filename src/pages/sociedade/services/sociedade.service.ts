import axios from "axios";
import {
    iParamToInsert,
    iSociedade,
    iCliente,
    iUpdateSociedadeParam,
    iFieldDuplicity,
    iGetDuplicityResponse,
    iToDeleteResponse,

} from '../interfaces';

const caminho = "taap/sociedade";

type iGetClienteFunction = (param: string, offset: number) => Promise<iCliente>;
type iGetSociedadeFunction = (param: string) => Promise<iSociedade>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iSociedade>;
type iToUpdateFunction = (param: iUpdateSociedadeParam) => Promise<void>;

const getSociedade: iGetSociedadeFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getSociedade",
        param,
    });
    return data;
};

const getCliente: iGetClienteFunction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getCliente",
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
    getSociedade,
    getCliente,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete,
};