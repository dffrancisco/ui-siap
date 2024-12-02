import axios from "axios";
import { iParamGetFornecedor, iFornecedores, iFieldDuplicity, iParamToInsert, iParamToUpdate, } from '../interfaces';

const caminho = "siap/fornecedores";

const getFornecedores = async ({ param, offset }: iParamGetFornecedor): Promise<iFornecedores[]> => {
    const { data } = await axios.post(caminho, {
        call: "getFornecedores",
        offset,
        param,
    });
    return data;
};

const getRepresentantes = async (offset: number, nome: string) => {
    const { data } = await axios.post(caminho, {
        call: "getRepresentantes",
        offset,
        nome,
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


const toDelete = async (id_fornecedor: number): Promise<iToDeleteResponse> => {
    const { data } = await axios.post(caminho, {
        call: "delete",
        id_fornecedor,
    });
    return data;
};

export default {
    getFornecedores,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete,
    getRepresentantes
};
