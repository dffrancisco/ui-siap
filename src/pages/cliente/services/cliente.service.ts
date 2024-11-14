import axios from "axios";
import { iClientes, iDadosInputs, iGetClientes } from "../interfaces";
type iGetDadosParaInputs = () => Promise<iDadosInputs>
type iGetClientesFuction = (param: iGetClientes, offset: number) => Promise<iClientes>

const caminho = 'siap/cliente'

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}

const getClientes: iGetClientesFuction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getClientes",
        offset,
        param
    });

    return data;
}

export default {
    getDadosParaInputs,
    getClientes,
}