import axios from "axios";
import { iDadosIniciaisConfigBoleto, iParamUpdateConfigBoleto } from "../interfaces";
type iGetDadosIniciaisConfigBoleto = () => Promise<iDadosIniciaisConfigBoleto>
type iUpdateConfigBoleto = (param: iParamUpdateConfigBoleto) => Promise<iDadosIniciaisConfigBoleto>
const caminho = "siap/configBoleto";

const getDadosIniciaisConfigBoleto: iGetDadosIniciaisConfigBoleto = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosIniciaisConfigBoleto"
    });
    return data;
}

const updateConfigBoleto: iUpdateConfigBoleto = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "updateConfigBoleto",
        param
    });
    return data;
}

export default {
    getDadosIniciaisConfigBoleto,
    updateConfigBoleto
};