import axios from "axios";
import {
    iParamToGetRamal,
    iParamToInsertRamal,
    iParamToUpdateRamal,
    iParamToGetSetor,
    iRamal,
    iSetor,
    iToDeleteResponse
} from "../interfaces";

const caminho = "siap/gerirRamais";

// Ramais
const getRamais = async ({ param, offset }: iParamToGetRamal): Promise<iRamal[]> => {
    const { data } = await axios.post(caminho, {
        call: "getRamais",
        offset,
        param,
    });
    return data;
};

const getDuplicidade = async ({ value, field }: { value: string; field: string }): Promise<boolean> => {
    const { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field,
    });
    return data;
};

const toInsert = async (newFields: iParamToInsertRamal): Promise<iRamal> => {
    const { data } = await axios.post(caminho, {
        call: "insertRamal",
        param: newFields,
    });
    return data;
};

const toUpdate = async (param: iParamToUpdateRamal): Promise<iRamal> => {
    const { data } = await axios.post(caminho, {
        call: "updateRamal",
        param,
    });
    return data;
};

const toDelete = async (id_ramal: number): Promise<iToDeleteResponse> => {
    const { data } = await axios.post(caminho, {
        call: "deleteRamal",
        id_ramal,
    });
    return data;
};


const getSetores = async ({ param, offset }: iParamToGetSetor): Promise<iSetor[]> => {
    const { data } = await axios.post(caminho, {
        call: "getSetores",
        offset,
        param,
    });
    return data;
};

export default {
    getRamais,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete,
    getSetores,
};
