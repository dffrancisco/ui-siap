import axios from "axios";
import { iCarros, iDadosFiltro, iFiltros, iFuncionario, iInsertOuUpdate, iMarcas, iParamFiltrar, iResultPesquisa, iUpdateNomeFiltro } from "../interfaces";

const caminho = 'siap/filtro'

type iGetFuncionarios = () => Promise<iFuncionario[]>
type iGetMarcas = () => Promise<iMarcas[]>
type iGetCarros = () => Promise<iCarros[]>
type iGetFiltros = () => Promise<iFiltros[]>
type iGetDadosParaFiltragem = (param: iParamFiltrar) => Promise<iResultPesquisa[]>
type iGetDadosFiltroSelecionado = (param: number) => Promise<iDadosFiltro[]>
type iUpdateFiltro = (param: iInsertOuUpdate) => Promise<string[]>
type iInsertFiltro = (param: iInsertOuUpdate) => Promise<string[]>
type iFinalizarFiltro = (param: number) => Promise<string[]>
type iDeletarItem = (param: number) => Promise<string[]>
type iFunctionUpdateNomeFiltro = (param: iUpdateNomeFiltro) => Promise<string[]>


const getFuncionarios: iGetFuncionarios = async () => {
    let { data } = await axios.post(caminho, {
        call: "getFuncionarios",
    });

    return data;
}

const getMarcas: iGetMarcas = async () => {
    let { data } = await axios.post(caminho, {
        call: "getMarcas",
    });

    return data;
}

const getCarros: iGetCarros = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCarros"
    });

    return data;
}

const getFiltros: iGetFiltros = async () => {
    let { data } = await axios.post(caminho, {
        call: "getFiltros"
    });

    return data;
}

const getFiltroSelected: iGetDadosFiltroSelecionado = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getFiltroSelected",
        param
    });

    return data;
}

const getDadosParaFiltragem: iGetDadosParaFiltragem = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaFiltragem",
        param
    });

    return data;
}

const atualizarFiltro: iUpdateFiltro = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "atualizarFiltro",
        param
    });

    return data;
}

const inserirFiltro: iInsertFiltro = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "inserirFiltro",
        param
    });

    return data;
}

const finalizarFiltro: iFinalizarFiltro = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "finalizarFiltro",
        param
    });

    return data;
}

const deletarFiltro: iFinalizarFiltro = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deletarFiltro",
        param
    });

    return data;
}

const deleteItemFiltro: iDeletarItem = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deleteItemFiltro",
        param
    });

    return data;
}

const updateConferenteNomeFiltro: iFunctionUpdateNomeFiltro = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "updateConferenteNomeFiltro",
        param
    });

    return data;
}

export default {
    getFuncionarios,
    getMarcas,
    getCarros,
    getFiltros,
    getFiltroSelected,
    getDadosParaFiltragem,
    atualizarFiltro,
    inserirFiltro,
    finalizarFiltro,
    deletarFiltro,
    deleteItemFiltro,
    updateConferenteNomeFiltro
}