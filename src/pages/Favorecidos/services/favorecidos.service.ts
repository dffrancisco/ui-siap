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

const FavorecidosChama = {
    GetFavorecidos: "getFavorecidos",
    GetDuplicidade: "getDuplicidade",
    Insert: "insert",
    Update: "update",
    Delete: "delete",
};

const getFavorecidos = async ({ param, offset }: iParamGetFavorecido): Promise<iFavorecidoResponse> => {
    const { data } = await axios.post(caminho, {
        call: FavorecidosChama.GetFavorecidos,
        offset,
        param,
    });
    return data;
};


const getDuplicidade = async ({ value, field }: iFieldDuplicity): Promise<iGetDuplicityResponse> => {
    const { data } = await axios.post(caminho, {
        call: FavorecidosChama.GetDuplicidade,
        value,
        field,
    });
    return data;
};

const toInsert = async (newFields: iParamToInsert): Promise<iInsertResponse> => {
    const { data } = await axios.post(caminho, {
        call: FavorecidosChama.Insert,
        param: newFields,
    });
    return data;
};


const toUpdate = async (param: iParamToUpdate) => {
    let { data } = await axios.post(caminho, {
        call: FavorecidosChama.Update,
        param,
    });
    return data;
};

const toDelete = async (id_favorecido: number): Promise<iToDeleteResponse> => {
    let { data } = await axios.post(caminho, {
        call: FavorecidosChama.Delete,
        id_favorecido,
    });
    return data;
};

export default {
    getFavorecidos,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete,
};
