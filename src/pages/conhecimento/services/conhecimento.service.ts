import axios from "axios";
import { iClientes, iDadosInputs, iGetClientes, iInsertOrUpdateCliente } from "../interfaces";
type iGetDadosParaInputs = () => Promise<iDadosInputs>
type iGetClientesFuction = (param: iGetClientes, offset: number) => Promise<iClientes>
type iInsertUpdateCliente = (param: iInsertOrUpdateCliente) => Promise<any>
type iDeleteCliente = (param: number) => Promise<string>

const caminho = 'siap/cliente'



const getClientes: iGetClientesFuction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getClientes",
        offset,
        param
    });

    return data;
}


const toInsert: iInsertUpdateCliente = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insert",
        param
    })
    return data;
}

const toUpdate: iInsertUpdateCliente = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "update",
        param
    })
    return data;
}

const toDelete = async (id_conhecimento: number): Promise<iToDeleteResponse> => {
    let { data } = await axios.post(caminho, {
        call: "delete",
        id_conhecimento
    });
    return data
};


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