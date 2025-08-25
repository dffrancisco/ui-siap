import axios from "axios";
import {
    iRepresentantes,
    iMarcasParam,
    iGetDuplicityResponse,
    iFieldDuplicity,
    iSearchMarcas,
    iParamToInsert,
    iParamGetRepresentantes,
    iParamToUpdate,
    iGetRepresentantes,
} from "../interfaces";

const caminho = "taap/representantes";

type iGetRepresentantesFunction = (param: iParamGetRepresentantes) => Promise<iGetRepresentantes[]>;
type iGetMarcas = (param: iSearchMarcas, offset: number) => Promise<iMarcasParam>;
type iToInsertFunction = (param: iParamToInsert) => Promise<iRepresentantes>;
type iToUpdateFunction = (param: iParamToUpdate) => Promise<void>;

const getMarcas: iGetMarcas = async (param, offset) => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas",
        offset,
        param,
    });
    return data;
};

const getRepresentantes: iGetRepresentantesFunction = async ({ param, offset }) => {
    let { data } = await axios.post(caminho, {
        call: "getRepresentantes",
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

const toInativar = async (ID_REPRESENTANTE: number) => {
    await axios.post(caminho, {
        call: "inativar",
        ID_REPRESENTANTE: ID_REPRESENTANTE
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
    toInativar,
};
