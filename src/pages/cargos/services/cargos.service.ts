import axios from "axios";
import {
    iAdicionarCargoResponse,
    iAlterarCargoResponse,
    iGetCargosResponse,
    iParamAdicionarCargo,
    iParamAlterarCargo,
    iParamGetCargo
} from '../interfaces'

const caminho = 'siap/cargos'

type iGetCargosFunction = (param: iParamGetCargo) => Promise<iGetCargosResponse>
type iAdicionarCargoFunction = (param: iParamAdicionarCargo) => Promise<iAdicionarCargoResponse>
type iAlterarCargoFunction = (param: iParamAlterarCargo) => Promise<iAlterarCargoResponse>

const getCargos: iGetCargosFunction = async ({ offset, param, checkbox }) => {
    let { data } = await axios.post(caminho, {
        call: "getCargos",
        offset,
        param,
        checkbox
    });
    return data;
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

export default {
    getCargos,
    adicionarCargo,
    alterarCargo
}