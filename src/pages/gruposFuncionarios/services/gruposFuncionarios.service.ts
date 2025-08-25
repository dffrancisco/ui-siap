import axios from "axios";
import {
    iDeleteGrupoImpressaoFuncionarioResponse,
    iDeleteGrupoImpressaoResponse,
    iGetDuplicityGrupoImpressaoResponse,
    iGetFuncionariosResponse,
    iGetGruposImpressaoResponse,
    iInsertGrupoImpressaoFuncionarioResponse,
    iInsertGrupoImpressaoResponse,
    iParamDeleteGrupoImpressao,
    iParamDeleteGrupoImpressaoFuncionario,
    iParamGetDuplicityGrupoImpressao,
    iParamGetGruposImpressao,
    iParamInsertGrupoImpressao,
    iParamInsertGrupoImpressaoFuncionario,
    iParamUpdateGrupoImpressao,
    iUpdateGrupoImpressaoResponse
} from "../interfaces";

const caminho = 'taap/gruposFuncionarios'

type iGetGruposImpressaoFunction = ({ offset, param }: iParamGetGruposImpressao) =>
    Promise<iGetGruposImpressaoResponse>
type iGetDuplicityGrupoImpressaoFunction = ({ field, value }: iParamGetDuplicityGrupoImpressao) =>
    Promise<iGetDuplicityGrupoImpressaoResponse>
type iInsertGrupoImpressaoFunction = (param: iParamInsertGrupoImpressao) => Promise<iInsertGrupoImpressaoResponse>
type iUpdateGrupoImpressaoFunction = (param: iParamUpdateGrupoImpressao) => Promise<iUpdateGrupoImpressaoResponse>
type iDeleteGrupoImpressaoFunction = (param: iParamDeleteGrupoImpressao) => Promise<iDeleteGrupoImpressaoResponse>
type iGetFuncionariosFunction = () => Promise<iGetFuncionariosResponse[]>
type iInsertGrupoImpressaoFuncionarioFunction = (param: iParamInsertGrupoImpressaoFuncionario) =>
    Promise<iInsertGrupoImpressaoFuncionarioResponse>
type iDeleteGrupoImpressaoFuncionarioFunction = (param: iParamDeleteGrupoImpressaoFuncionario) =>
    Promise<iDeleteGrupoImpressaoFuncionarioResponse>

const getGruposImpressao: iGetGruposImpressaoFunction = async ({ offset, param }) => {
    let { data } = await axios.post(caminho, {
        call: "getGruposImpressao",
        offset,
        param
    })
    return data;
}

const getDuplicityGrupoImpressao: iGetDuplicityGrupoImpressaoFunction = async ({ field, value }) => {
    let { data } = await axios.post(caminho, {
        call: "getDuplicityGrupoImpressao",
        field,
        value
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

const getFuncionarios: iGetFuncionariosFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: "getFuncionarios"
    })
    return data;
}

const insertGrupoImpressaoFuncionario: iInsertGrupoImpressaoFuncionarioFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertGrupoImpressaoFuncionario",
        param
    })
    return data;
}

const deleteGrupoImpressaoFuncionario: iDeleteGrupoImpressaoFuncionarioFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deleteGrupoImpressaoFuncionario",
        param
    })
    return data;
}

export default {
    getGruposImpressao,
    getDuplicityGrupoImpressao,
    insertGrupoImpressao,
    updateGrupoImpressao,
    deleteGrupoImpressao,
    getFuncionarios,
    insertGrupoImpressaoFuncionario,
    deleteGrupoImpressaoFuncionario
}