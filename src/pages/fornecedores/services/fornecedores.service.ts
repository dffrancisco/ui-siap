import axios from "axios";
import {
    iParamGetFornecedor,
    iParamGetRepresentante,
    iFornecedores,
    iInsertResponse,
    iParamToUpdate,
    iToDeleteResponse,
    iGetDuplicityResponse,
    iFieldDuplicity
} from '../interfaces';

const caminho = "siap/fornecedores";

type iGetFornecedoresFunction = (param: iParamGetFornecedor) => Promise<iFornecedores[]>;
type iGetRepresentantesFunction = (param: iParamGetRepresentante, offset: number) => Promise<iFornecedores[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;
type iToInsertFunction = (param: iInsertResponse) => Promise<iInsertResponse>;
type iToUpdateFunction = (param: iParamToUpdate) => Promise<void>;
type iToDeleteFunction = (idFornecedor: number) => Promise<iToDeleteResponse>;
type iToInativarFunction = (idFornecedor: number, deletado: string | null) => Promise<void>;
type iBuscarCEPFunction = (cep: string) => Promise<string>;
type iGetDadosCnpjFunction = (cnpj: string) => Promise<string>;
type iGetDadosParaInputs = () => Promise<any>;

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    const { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
};

const getFornecedores: iGetFornecedoresFunction = async ({ param, offset }) => {
    const { data } = await axios.post(caminho, {
        call: "getFornecedores",
        offset,
        param,
    });
    return data;
};

const getRepresentantes: iGetRepresentantesFunction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getRepresentantes",
        offset,
        param,
    });
    return data;
};

const getDuplicidade: iGetDuplicityFunction = async ({ value, field }) => {
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
    await axios.post(caminho, {
        call: "update",
        param,
    });
};

const toDelete: iToDeleteFunction = async (idFornecedor) => {
    const { data } = await axios.post(caminho, {
        call: "delete",
        id_fornecedor: idFornecedor,
    });
    return data;
};

const toInativar: iToInativarFunction = async (idFornecedor, deletado) => {
    await axios.post(caminho, {
        call: "inativar",
        idFornecedor,
        deletado,
    });
};

const buscarCEP: iBuscarCEPFunction = async (cep) => {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return data;
};

const getDadosCnpj: iGetDadosCnpjFunction = async (cnpj) => {
    const { data } = await axios.post(caminho, {
        call: "getDadosCnpj",
        cnpj,
    });
    return data;
};



export default {
    getFornecedores,
    getRepresentantes,
    getDuplicidade,
    toInsert,
    toUpdate,
    toDelete,
    toInativar,
    buscarCEP,
    getDadosCnpj,
};