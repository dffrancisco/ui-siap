import axios from "axios";
import { iClientes, iDadosInputs, iGetClientes, iInsertOrUpdateCliente } from "../interfaces";
type iGetDadosParaInputs = () => Promise<iDadosInputs>
type iGetClientesFuction = (param: iGetClientes, offset: number) => Promise<iClientes>
type iInsertUpdateCliente = (param: iInsertOrUpdateCliente) => Promise<string>

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

const buscarCEP = async (cep: string) => {
    let data = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    return data;
}

const insertOuUpdateCliente: iInsertUpdateCliente = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertOrUpdateCliente",
        param
    })
    return data;
}

export default {
    getDadosParaInputs,
    getClientes,
    buscarCEP,
    insertOuUpdateCliente,
}