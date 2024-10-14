import axios from "axios";
import {
    iParamToInsert,
    iParamGetFavorecido,
    iFavorecidoResponse,
    iParamToUpdate,
    iFieldDuplicity,
    iGetDuplicityResponse,
    iToDeleteResponse,
    iInsertResponse,

} from '../interfaces';

const caminho = "siap/favorecidos";

const getFavorecidos = async ({ param, offset }: iParamGetFavorecido): Promise<iFavorecidoResponse> => {
    const { data } = await axios.post(caminho, {
        call: "getFavorecidos",
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
    let { data } = await axios.post(caminho, {
        call: "update",
        param,
    });
    return data;
};

const toDelete = async (id_favorecido: number): Promise<iToDeleteResponse> => {
    let { data } = await axios.post(caminho, {
        call: "delete",
        id_favorecido,
    });
    return data;
};


export default
    {
        getFavorecidos,
        getDuplicidade,
        toInsert,
        toUpdate,
        toDelete,

    };
