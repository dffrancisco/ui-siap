import axios from "axios";
import {
    iRepresentantes,
    iMarcasParam,
    iGetDuplicityResponse,
    iFieldDuplicity,
    iSearchMarcas,
    iParamToInsert,
    iParamToUpdate,
    iGetRepresentantes,
} from "../interfaces";

const caminho = "siap/representantes";

type iGetMarcas = (param: iSearchMarcas, offset: number) => Promise<iMarcasParam>;
type iGetRepresentantesFunction = (param: string) => Promise<iGetRepresentantes>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iRepresentantes>;
type iToUpdateFunction = (param: iParamToUpdate) => Promise<void>;
type iToDeleteFunction = (id_Representantes: number) => Promise<void>;

const getMarcas: iGetMarcas = async (param, offset) => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas",
        offset,
        param,

    });

    return data;
};

const getRepresentantes: iGetRepresentantesFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getRepresentantes",
        param,
    });
    return data as iGetRepresentantes;
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

const getCidades = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCidades"
    });

    return data;
}

const buscarCEP = async (cep: string) => {
    let data = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return data;
}

export default {
    getMarcas,
    getRepresentantes,
    buscarCEP,
    getCidades,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete,
};
