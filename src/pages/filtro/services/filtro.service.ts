import axios from "axios";
import {
    iDadosFiltro, iDeleteItem, iFinalizarFiltro, iInsertOuUpdate, iParamFiltrar, iParamFiltros,
    iResponseDadosParaFiltros, iResponseFiltros, iResultPesquisa, iUpdateNomeFiltro
} from "../interfaces";

const caminho = 'siap/filtro'
type iGetFiltros = (param: iParamFiltros) => Promise<iResponseFiltros>
type iGetDadosParaFiltragem = (param: iParamFiltrar) => Promise<iResultPesquisa[]>
type iGetDadosFiltroSelecionado = (param: number) => Promise<iDadosFiltro[]>
type iUpdateFiltro = (param: iInsertOuUpdate) => Promise<string[]>
type iInsertFiltro = (param: iInsertOuUpdate) => Promise<string[]>
type iFunctionFinalizarFiltro = (param: iFinalizarFiltro) => Promise<string[]>
type iFunctionDeletarFiltro = (param: number) => Promise<string[]>
type iDeletarItem = (param: iDeleteItem) => Promise<string[]>
type iFunctionUpdateNomeFiltro = (param: iUpdateNomeFiltro) => Promise<string[]>
type iGetDadosParaFiltros = () => Promise<iResponseDadosParaFiltros>
type iFunctionFiltroParaRevisao = (param: number) => Promise<any[]>

const getDadosParaFiltros: iGetDadosParaFiltros = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaFiltros"
    });

    return data;
}

const getFiltros: iGetFiltros = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getFiltros",
        param
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

const finalizarFiltro: iFunctionFinalizarFiltro = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "finalizarFiltro",
        param
    });

    return data;
}

const deletarFiltro: iFunctionDeletarFiltro = async (param) => {
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

const getFiltroParaRevisao: iFunctionFiltroParaRevisao = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getFiltroParaRevisao",
        param
    });

    return data;
}

const revisarFiltro = async (idFiltro) => {
    let { data } = await axios.post(caminho, {
        call: "revisarFiltro",
        idFiltro
    })

    return data
}

export default {
    getFiltros,
    getDadosParaFiltros,
    getFiltroSelected,
    getDadosParaFiltragem,
    atualizarFiltro,
    inserirFiltro,
    finalizarFiltro,
    deletarFiltro,
    deleteItemFiltro,
    updateConferenteNomeFiltro,
    getFiltroParaRevisao,
    revisarFiltro
}