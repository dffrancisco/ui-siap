import axios from "axios";
import {
    iGetVendasResponse,
    iParamGetVendasDetalhes,
    iParamGetVendas,
    iGetVendasDetalhesResponse,
    iParamGetVendasGraficos,
    iGetVendasGraficosResponse,
    iGetFuncionariosResponse,
    iParamInsertGrupoImpressao,
    iParamUpdateGrupoImpressao,
    iParamDeleteGrupoImpressao,
    iGetGruposImpressaoResponse,
    iInsertGrupoImpressaoResponse,
    iUpdateGrupoImpressaoResponse,
    iDeleteGrupoImpressaoResponse
} from "../interfaces";
const caminho = 'siap/vendaPorVendedor'

type iGetVendasFunction = (param: iParamGetVendas) => Promise<iGetVendasResponse[]>
type iGetVendasDetalhesFunction = (param: iParamGetVendasDetalhes) => Promise<iGetVendasDetalhesResponse>
type iGetVendasGraficosFunction = (param: iParamGetVendasGraficos) => Promise<iGetVendasGraficosResponse>
type iGetFuncionariosFunction = () => Promise<iGetFuncionariosResponse[]>
type iGetGruposImpressaoFunction = () => Promise<iGetGruposImpressaoResponse[]>
type iInsertGrupoImpressaoFunction = (param: iParamInsertGrupoImpressao) => Promise<iInsertGrupoImpressaoResponse>
type iUpdateGrupoImpressaoFunction = (param: iParamUpdateGrupoImpressao) => Promise<iUpdateGrupoImpressaoResponse>
type iDeleteGrupoImpressaoFunction = (param: iParamDeleteGrupoImpressao) => Promise<iDeleteGrupoImpressaoResponse>

const getVendas: iGetVendasFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendas",
        param
    })

    return data;
}

const getVendasDetalhes: iGetVendasDetalhesFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendasDetalhes",
        param
    })

    return data;
}

const getVendasGraficos: iGetVendasGraficosFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getVendasGraficos",
        param
    })

    return data;
}

const getFuncionarios: iGetFuncionariosFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getFuncionarios"
    })

    return data;
}

const getGruposImpressao: iGetGruposImpressaoFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getGruposImpressao"
    })

    return data;
}

const insertGrupoImpressao: iInsertGrupoImpressaoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertGrupoImpressao",
        param
    })

    return data;
}

const updateGrupoImpressao: iUpdateGrupoImpressaoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "updateGrupoImpressao",
        param
    })

    return data;
}

const deleteGrupoImpressao: iDeleteGrupoImpressaoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deleteGrupoImpressao",
        param
    })

    return data;
}

export default {
    getVendas,
    getVendasDetalhes,
    getVendasGraficos,
    getFuncionarios,
    getGruposImpressao,
    insertGrupoImpressao,
    updateGrupoImpressao,
    deleteGrupoImpressao
};