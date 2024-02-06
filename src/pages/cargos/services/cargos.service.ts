import axios from "axios";
import { iGetCargosResponse, iParamGetCargo } from '../interfaces'

const caminho = 'siap/cargos'

type iGetCargosFunction = (param: iParamGetCargo) => Promise<iGetCargosResponse>

const getCargos: iGetCargosFunction = async ({offset, param, checkbox}) => {
    let { data } = await axios.post(caminho, {
        call: "getCargos",
        offset,
        param,
        checkbox
    });
    return data;
}

export default {
    getCargos
}