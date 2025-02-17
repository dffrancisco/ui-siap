import axios from "axios";
import {
    iConhecimento,
    iInsertConhecimentoParam,
    iUpdateConhecimento,
    iToDeleteResponse,
    iFieldDuplicity,
    iGetDuplicityResponse
} from "../interfaces";


type iGetConhecimentoFunction = (param: string) => Promise<iConhecimento>;
type iToInsertFunction = (param: iInsertConhecimentoParam) => Promise<any>;
type iToUpdateFunction = (param: iUpdateConhecimento) => Promise<void>;

const caminho = 'siap/conhecimento'

const getConhecimento: iGetConhecimentoFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getConhecimento",
        param
    });
    return data;
}

const toInsert: iToInsertFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param
    })
    return data;
}

const toUpdate: iToUpdateFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "update",
        param
    })
    return data;
}

const toDelete = async (id_conhecimento: number): Promise<iToDeleteResponse> => {
    let { data } = await axios.post(caminho, {
        call: "delete",
        id_conhecimento
    });
    return data
};

const getDuplicidade = async ({ value, field }: iFieldDuplicity): Promise<iGetDuplicityResponse> => {
    const { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field,
    });
    return data;
};

export default {
    getConhecimento,
    getDuplicidade,
    toDelete,
    toUpdate,
    toInsert
}