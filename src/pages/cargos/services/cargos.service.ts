import axios from "axios";
import {
    iAdicionarCargoResponse,
    iAlterarCargoResponse,
    iFieldDuplicity,
    iGetCargosResponse,
    iGetDuplicityResponse,
    iInativarCargoResponse,
    iParamAdicionarCargo,
    iParamAlterarCargo,
    iParamGetCargo,
    iParamInativarCargo
} from '../interfaces'

const caminho = 'siap/cargos'

type iGetCargosFunction = (param: iParamGetCargo) => Promise<iGetCargosResponse>
type iGetDuplicityFunction = (param: iFieldDuplicity) => Promise<iGetDuplicityResponse>;
type iAdicionarCargoFunction = (param: iParamAdicionarCargo) => Promise<iAdicionarCargoResponse>
type iAlterarCargoFunction = (param: iParamAlterarCargo) => Promise<iAlterarCargoResponse>
type iInativarCargoFunction = (param: iParamInativarCargo) => Promise<iInativarCargoResponse>

const getCargos: iGetCargosFunction = async ({ offset, param, checkbox }) => {
    let { data } = await axios.post(caminho, {
        call: "getCargos",
        offset,
        param,
        checkbox
    });
    return data;
}

const getDuplicidade: iGetDuplicityFunction = async ({ value, field }) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicidade",
        value,
        field
    });

    return data
}


const adicionarCargo: iAdicionarCargoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "adicionarCargo",
        param
    });
    return data;
}

const alterarCargo: iAlterarCargoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "alterarCargo",
        param
    });
    return data;
}

const inativarCargo: iInativarCargoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "inativarCargo",
        param
    });
    return data;
}

export default {
    getCargos,
    getDuplicidade,
    adicionarCargo,
    alterarCargo,
    inativarCargo
}