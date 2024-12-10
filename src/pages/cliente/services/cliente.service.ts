import axios from "axios";
import { iClientes, iDadosInputs, iGetClientes, iInsertOrUpdateCliente } from "../interfaces";
type iGetDadosParaInputs = () => Promise<iDadosInputs>
type iGetClientesFuction = (param: iGetClientes, offset: number) => Promise<iClientes>
type iInsertUpdateCliente = (param: iInsertOrUpdateCliente) => Promise<any>
type iDeleteCliente = (param: number) => Promise<string>

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

const deletarCliente: iDeleteCliente = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deletarCliente",
        param
    });
    return data;
}

const buscarCNAE = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "buscarCNAE",
        param
    });
    return data;
}

const verificarSeClienteExiste = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "verificarSeClienteExiste",
        param
    });
    return data;
}

const ativarCliente = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "ativarCliente",
        param
    });
    return data;
}

export default {
    getDadosParaInputs,
    getClientes,
    buscarCEP,
    insertOuUpdateCliente,
    deletarCliente,
    buscarCNAE,
    verificarSeClienteExiste,
    ativarCliente
}