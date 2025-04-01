import axios from 'axios';
import {
    iNfeConfig,
    iRegimeTributario,
    iPis,
    iCofins,
    iInsertRegimeTributario,
    iFieldDuplicity,
    iResponseDadosInputs,
    iGetDuplicityResponse
} from '../interfaces';

type iGetDadosParaInputs = () => Promise<iResponseDadosInputs>;
type GetVerifica = (param: { REGIME_TRIBUTARIO: number }) => Promise<iNfeConfig[]>;

type UpdateNfeConfigFn = (param: Partial<iNfeConfig>) => Promise<void>;

type InsertRegimeTributario = (param: iInsertRegimeTributario) => Promise<iRegimeTributario>;
type UpdateRegimeTributario = (param: iRegimeTributario) => Promise<void>;
type DeleteRegimeTributario = (id: number) => Promise<{ success: boolean }>;

type InsertPis = (param: iPis) => Promise<iPis>;
type UpdatePis = (param: iPis) => Promise<void>;
type DeletePis = (id: number) => Promise<{ success: boolean }>;

type InsertCofins = (param: iCofins) => Promise<iCofins>;
type UpdateCofins = (param: iCofins) => Promise<void>;
type DeleteCofins = (id: number) => Promise<{ success: boolean }>;


const caminho = 'siap/configuracaoNfe';

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getDadosParaInputs'
    });
    return data;
};

const updateNfeConfig: UpdateNfeConfigFn = async (param) => {
    await axios.post(caminho, {
        call: 'updateNfe',
        param
    });
};

// Regime Tributário
const toInsertRegimeTributario: InsertRegimeTributario = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "createRegimeTributario",
        param
    });
    return data;
};

const toUpdateRegimeTributario: UpdateRegimeTributario = async (param) => {
    await axios.post(caminho, {
        call: "updateRegimeTributario",
        param
    });
};

const toDeleteRegimeTributario: DeleteRegimeTributario = async (ID_REGIME_TRIBUTARIO) => {
    const { data } = await axios.post(caminho, {
        call: "deleteRegimeTributario",
        param: { ID_REGIME_TRIBUTARIO }
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

// Pis
const toInsertPis: InsertPis = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "createPis",
        param
    });
    return data;
};

const toUpdatePis: UpdatePis = async (param) => {
    await axios.post(caminho, {
        call: "updatePis",
        param
    });
};

const toDeletePis: DeletePis = async (id) => {
    const { data } = await axios.post(caminho, {
        call: "deletePis",
        param: { ID_PIS: id }
    });
    return data;
};

// Cofins
const toInsertCofins: InsertCofins = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "createCofins",
        param
    });
    return data;
};

const toUpdateCofins: UpdateCofins = async (param) => {
    await axios.post(caminho, {
        call: "updateCofins",
        param
    });
};

const toDeleteCofins: DeleteCofins = async (id) => {
    const { data } = await axios.post(caminho, {
        call: "deleteCofins",
        param: { ID_COFINS: id }
    });
    return data;
};

// Duplicidade
const getDuplicidade = async ({ value, field }: iFieldDuplicity): Promise<iGetDuplicityResponse> => {
    const { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field,
    });
    return data;
};

export default {
    getDadosParaInputs,
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