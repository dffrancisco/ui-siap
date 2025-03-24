import axios from 'axios';
import {
    iNfeConfig,
    iRegimeTributario,
    iPis,
    iCofins,
    iInsertRegimeTributario,
    iDeleteRegimeTributario,
    iDuplicity,
    iGetDuplicityResponse
} from '../interfaces';

const caminho = 'configuracaoNfe';


type GetNfeConfigFn = () => Promise<iNfeConfig[]>;
type GetRegimeTributarioFn = () => Promise<iRegimeTributario[]>;
type GetPisFn = () => Promise<iPis[]>;
type GetCofinsFn = () => Promise<iCofins[]>;
type GetVerifica = (param: { REGIME_TRIBUTARIO: number }) => Promise<iNfeConfig[]>;

type UpdateNfeConfigFn = (param: Partial<iNfeConfig>) => Promise<void>;

type InsertRegimeTributarioFn = (param: iInsertRegimeTributario) => Promise<iRegimeTributario>;
type UpdateRegimeTributarioFn = (param: iRegimeTributario) => Promise<void>;
type DeleteRegimeTributarioFn = (id: number) => Promise<{ success: boolean }>;

type InsertPisFn = (param: iPis) => Promise<iPis>;
type UpdatePisFn = (param: iPis) => Promise<void>;
type DeletePisFn = (id: number) => Promise<{ success: boolean }>;

type InsertCofinsFn = (param: iCofins) => Promise<iCofins>;
type UpdateCofinsFn = (param: iCofins) => Promise<void>;
type DeleteCofinsFn = (id: number) => Promise<{ success: boolean }>;

type Duplicidade = (param: iDuplicity) => Promise<iGetDuplicityResponse>;



const getNfeConfig: GetNfeConfigFn = async () => {
    const { data } = await axios.post(caminho, { call: 'getNfeConfig' });
    return data;
};

const getRegimeTributario: GetRegimeTributarioFn = async () => {
    const { data } = await axios.post(caminho, { call: 'getRegimeTributario' });
    return data;
};

const getPis: GetPisFn = async () => {
    const { data } = await axios.post(caminho, { call: 'getPis' });
    return data;
};

const getCofins: GetCofinsFn = async () => {
    const { data } = await axios.post(caminho, { call: 'getCofins' });
    return data;
};

const updateNfeConfig: UpdateNfeConfigFn = async (param) => {
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
        param: { ID_PIS: id }
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
        param: { ID_COFINS: id }
    });
    return data;
};

const getDuplicidade: Duplicidade = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "duplicity",
        param
    });
    return data;
};

const verificarRegimeTributarioEmNfe: GetVerifica = async ({ REGIME_TRIBUTARIO }) => {
    const { data } = await axios.post(caminho, {
        call: "verificarRegimeTributarioEmNfe",
        param: { REGIME_TRIBUTARIO }
    });
    return data;
};

export default {
    getNfeConfig,
    getRegimeTributario,
    getPis,
    getCofins,
    updateNfeConfig,
    toUpdateRegimeTributario,
    toInsertRegimeTributario,
    toDeleteRegimeTributario,
    verificarRegimeTributarioEmNfe,
    toInsertPis,
    toUpdatePis,
    toDeletePis,
    toInsertCofins,
    toUpdateCofins,
    toDeleteCofins,
    getDuplicidade
};