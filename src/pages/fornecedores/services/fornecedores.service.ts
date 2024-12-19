import axios from "axios";
import {
    iParamGetFornecedor,
    iRepresentantes,
    iFornecedor,
    iGetDuplicityResponse,
    iFieldDuplicity,

} from "../interfaces";

const caminho = "siap/fornecedores";

type iGetFornecedoresFunction = (param: iParamGetFornecedor) => Promise<iFornecedor[]>;
type iGetRepresentantesFunction = (param: iRepresentantes, offset: number) => Promise<iFornecedor[]>;
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;
type iToInsertFunction = (param: iFornecedor) => Promise<iFornecedor>;
type iToUpdateFunction = (param: iFornecedor) => Promise<void>;


const getCidades = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCidades"
    });

    return data;
}


const getFornecedores: iGetFornecedoresFunction = async ({ param, offset, checkboxAtiva }) => {
    const { data } = await axios.post(caminho, {
        call: "getFornecedores",
        offset,
        param,
        checkboxAtiva

    });
    return data;
}

const getRepresentantes: iGetRepresentantesFunction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getRepresentantes",
        offset,
        param,
    });
    return data;
}

const getDuplicidade: iGetDuplicityFunction = async ({ value, field }) => {
    const { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field,
    });
    return data;
}

const toInsert: iToInsertFunction = async (newFields) => {

    const { data } = await axios.post(caminho, {
        call: "insert",
        param: newFields,
    });
    return data;
};

const toUpdate: iToUpdateFunction = async (param: object) => {
    let { data } = await axios.post(caminho, {
        call: "update",
        param
    });

    return data;
}

const toInativar = async (ID_FORNECEDOR: number, DELETADO: string | null) => {
    await axios.post(caminho, {
        call: "inativar",
        ID_FORNECEDOR: ID_FORNECEDOR,
        DELETADO: DELETADO
    })
}

const buscarCEP = async (cep: string) => {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return data;
}

const getDadosCnpj = async (cnpj: string) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosCnpj",
        cnpj
    })

    return data;
}

export default {
    getFornecedores,
    getRepresentantes,
    getDuplicidade,
    toInsert,
    toUpdate,
    toInativar,
    buscarCEP,
    getDadosCnpj,
    getCidades,
}
