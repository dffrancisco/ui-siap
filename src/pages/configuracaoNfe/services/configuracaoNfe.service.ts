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


type GetNfeConfigFn = () => Promise<iNfeConfig[]>;
type GetRegimeTributarioFn = () => Promise<iRegimeTributario[]>;
type GetPisFn = () => Promise<iPis[]>;
type GetCofinsFn = () => Promise<iCofins[]>;

type InsertNfeConfigFn = (param: iInsertNfeConfigParam) => Promise<void>;
type UpdateNfeConfigFn = (param: iUpdateNfeConfig) => Promise<void>;

type InsertRegimeTributarioFn = (param: iInsertRegimeTributario) => Promise<iRegimeTributario>;
type UpdateRegimeTributarioFn = (param: iRegimeTributario) => Promise<void>;
type DeleteRegimeTributarioFn = (id: number) => Promise<iToDeleteResponse>;

type InsertPisFn = (param: iPis) => Promise<iPis>;
type UpdatePisFn = (param: iPis) => Promise<void>;
type DeletePisFn = (id: number) => Promise<iToDeleteResponse>;

type InsertCofinsFn = (param: iCofins) => Promise<iCofins>;
type UpdateCofinsFn = (param: iCofins) => Promise<void>;
type DeleteCofinsFn = (id: number) => Promise<iToDeleteResponse>;

type CheckDuplicityFn = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;


const getNfeConfig: GetNfeConfigFn = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getNfeConfig'
    });
    return data;
};

const getRegimeTributario: GetRegimeTributarioFn = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getRegimeTributario'
    });
    return data;
};

const getPis: GetPisFn = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getPis'
    });
    return data;
};

const getCofins: GetCofinsFn = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getCofins'
    });
    return data;
};

const updateNfe: UpdateNfeConfigFn = async (param) => {
    await axios.post(caminho, {
        call: 'updateNfe',
        param
    });
};

const toInsertRegimeTributario: InsertRegimeTributarioFn = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "createRegimeTributario",
        param
    });
    return data;
};

const toUpdateRegimeTributario: UpdateRegimeTributarioFn = async (param) => {
    await axios.post(caminho, {
        call: "updateRegimeTributario",
        param
    });
};

const toDeleteRegimeTributario: DeleteRegimeTributarioFn = async (ID_REGIME_TRIBUTARIO) => {
    const { data } = await axios.post(caminho, {
        call: "deleteRegimeTributario",
        param: { ID_REGIME_TRIBUTARIO }
    });
    return data;
};

const toInsertPis: InsertPisFn = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "createPis",
        param
    });
    return data;
};

const toUpdatePis: UpdatePisFn = async (param) => {
    await axios.post(caminho, {
        call: "updatePis",
        param
    });
};

const toDeletePis: DeletePisFn = async (id) => {
    const { data } = await axios.post(caminho, {
        call: "deletePis",
        param: { id }
    });
    return data;
};

const toInsertCofins: InsertCofinsFn = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "createCofins",
        param
    });
    return data;
};

const toUpdateCofins: UpdateCofinsFn = async (param) => {
    await axios.post(caminho, {
        call: "updateCofins",
        param
    });
};

const toDeleteCofins: DeleteCofinsFn = async (id) => {
    const { data } = await axios.post(caminho, {
        call: "deleteCofins",
        param: { id }
    });
    return data;
};

const getDuplicidade: CheckDuplicityFn = async ({ value, field }) => {
    const { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        field,
        value
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