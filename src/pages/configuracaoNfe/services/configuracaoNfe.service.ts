import axios from 'axios';
import {
    iNfeConfig,
    iRegimeTributario,
    iPis,
    iCofins,
    iFieldDuplicity,
    iResponseDadosInputs,
    iGetDuplicityResponse
} from '../interfaces';


type iGetDadosParaInputs = () => Promise<iResponseDadosInputs>;
type GetVerifica = (param: { REGIME_TRIBUTARIO: number }) => Promise<iNfeConfig[]>;
type UpdatePis = (param: iPis) => Promise<void>;
type DeletePis = (id: number) => Promise<{ success: boolean }>;
type UpdateCofins = (param: iCofins) => Promise<void>;
type DeleteCofins = (id: number) => Promise<{ success: boolean }>;


const caminho = 'siap/configuracaoNfe';

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getDadosParaInputs'
    });
    return data;
};

const updateNfeConfig = async (param: iNfeConfig) => {
    let { data } = await axios.post(caminho, {
        call: 'updateNfe',
        param
    });
    return data;
};

// Regime Tributário
const toInsertRegimeTributario = async (newFields: iRegimeTributario): Promise<iRegimeTributario> => {
    const { data } = await axios.post(caminho, {
        call: "createRegimeTributario",
        param: newFields,
    });
    return data;
};

const toUpdateRegimeTributario = async (param: iRegimeTributario) => {
    const { data } = await axios.post(caminho, {
        call: "updateRegimeTributario",
        param,
    });
    return data;
};



// Pis
const toUpdatePis: UpdatePis = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "updatePis",
        param,
    });
    return data;
};

const toDeletePis: DeletePis = async (id) => {
    const { data } = await axios.post(caminho, {
        call: "deletePis",
        param: { ID_PIS: id }
    });
    return data;
};

// Cofins
const toUpdateCofins: UpdateCofins = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "updateCofins",
        param
    });
    return data;
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
    toUpdatePis,
    toDeletePis,
    toUpdateCofins,
    toDeleteCofins,
    getDuplicidade
};