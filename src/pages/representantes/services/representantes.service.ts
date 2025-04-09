import axios from "axios";
import {
    iParamGetRepresentantes,
    iRepresentantes,
    iGetDuplicityResponse,
    iFieldDuplicity,
    iParamToInsert,
    iParamToUpdate,
    iGetRepresentantes,
} from "../interfaces";

const caminho = "siap/representantes";


type iGetRepresentantesFunction = (param: string) => Promise<iGetRepresentantes>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iRepresentantes>;
type iToUpdateFunction = (param: iParamToUpdate) => Promise<void>;
type iToDeleteFunction = (id_Representantes: number) => Promise<void>;

const getMarcas = async () => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas",
    });

    return data;
};

const getRepresentantes: iGetRepresentantesFunction = async (param,) => {
    let { data } = await axios.post(caminho, {
        call: "getRepresentantes",
        param,
    });
    return data as iGetRepresentantes;
};

const getDuplicidade: iGetDuplicityFunction = async ({ value, field }) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field,
    });
    return data;
};

const toInsert: iToInsertFunction = async (newFields) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields,
    });
    return data;
};

const toUpdate: iToUpdateFunction = async (param) => {
    await axios.post(caminho, {
        call: "update",
        param,
    });
};

const toDelete: iToDeleteFunction = async (id_Representantes) => {
    await axios.post(caminho, {
        call: "delete",
        id_Representantes,
    });
};

export default {
    getMarcas,
    getRepresentantes,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete,
};
