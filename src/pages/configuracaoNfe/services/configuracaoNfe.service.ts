import axios from 'axios';
import {
    iNfeConfig,
    iInsertNfeConfigParam,
    iUpdateNfeConfig,
    iToDeleteResponse,
    iFieldDuplicity,
    iGetDuplicityResponse,
    iRegimeTributario,
    iPis,
    iCofins,
    iInsertRegimeTributario,
    iDeleteRegimeTributario,
    iDuplicity
} from '../interfaces';

const caminho = 'configuracaoNfe';
type iGetFunction<T> = () => Promise<Array<T>>;
type iUpdateFunction<T> = (param: T) => Promise<void>;
type iInsertFunction<T> = (param: T) => Promise<T>;
type iDeleteFunction = (param: { id: string | number }) => Promise<iToDeleteResponse>;
type iDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;

const getNfeConfig: iGetFunction<iNfeConfig> = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getNfeConfig'
    });
    return data;
};

const getRegimeTributario: iGetFunction<iRegimeTributario> = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getRegimeTributario'
    });
    return data;
};

const getPis: iGetFunction<iPis> = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getPis'
    });
    return data;
};

const getCofins: iGetFunction<iCofins> = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getCofins'
    });
    return data;
};

const updateNfe: iUpdateFunction<iUpdateNfeConfig> = async (param) => {
    await axios.post(caminho, {
        call: 'updateNfe',
        param
    });
};

const toInsertRegimeTributario: iInsertFunction<iInsertRegimeTributario> = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "createRegimeTributario",
        param
    });
    return data;
};

const toUpdateRegimeTributario: iUpdateFunction<iRegimeTributario> = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "updateRegimeTributario",
        param
    });
    return data;
};

const toDeleteRegimeTributario: iDeleteFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "deleteRegimeTributario",
        param
    });
    return data;
};

const toInsertPis: iInsertFunction<iPis> = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "createPis",
        param
    });
    return data;
};

const toUpdatePis: iUpdateFunction<iPis> = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "updatePis",
        param
    });
    return data;
};

const toDeletePis: iDeleteFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "deletePis",
        param
    });
    return data;
};

const toInsertCofins: iInsertFunction<iCofins> = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "createCofins",
        param
    });
    return data;
};

const toUpdateCofins: iUpdateFunction<iCofins> = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "updateCofins",
        param
    });
    return data;
};

const toDeleteCofins: iDeleteFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "deleteCofins",
        param
    });
    return data;
};

const getDuplicidade: iDuplicityFunction = async ({ value, field }) => {
    const { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field
    });
    return data;
};

export default {
    getNfeConfig,
    getRegimeTributario,
    getPis,
    getCofins,
    updateNfe,
    toUpdateRegimeTributario,
    toInsertRegimeTributario,
    toDeleteRegimeTributario,
    toInsertPis,
    toUpdatePis,
    toDeletePis,
    toInsertCofins,
    toUpdateCofins,
    toDeleteCofins,
    getDuplicidade
};
