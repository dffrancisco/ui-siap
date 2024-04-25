import axios from "axios";
import {
    iDeleteGrupoImpressaoResponse,
    iGetDuplicityGrupoImpressaoResponse,
    iGetGruposImpressaoResponse,
    iInsertGrupoImpressaoResponse,
    iParamDeleteGrupoImpressao,
    iParamGetDuplicityGrupoImpressao,
    iParamGetGruposImpressao,
    iParamInsertGrupoImpressao,
    iParamUpdateGrupoImpressao,
    iUpdateGrupoImpressaoResponse
} from "../interfaces";

const caminho = 'siap/gruposFuncionarios'

type iGetGruposImpressaoFunction = ({ offset, param }: iParamGetGruposImpressao) =>
    Promise<iGetGruposImpressaoResponse>
type iGetDuplicityGrupoImpressaoFunction = ({ field, value }: iParamGetDuplicityGrupoImpressao) =>
    Promise<iGetDuplicityGrupoImpressaoResponse>
type iInsertGrupoImpressaoFunction = (param: iParamInsertGrupoImpressao) => Promise<iInsertGrupoImpressaoResponse>
type iUpdateGrupoImpressaoFunction = (param: iParamUpdateGrupoImpressao) => Promise<iUpdateGrupoImpressaoResponse>
type iDeleteGrupoImpressaoFunction = (param: iParamDeleteGrupoImpressao) => Promise<iDeleteGrupoImpressaoResponse>

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

export default {
    getGruposImpressao,
    getDuplicityGrupoImpressao,
    insertGrupoImpressao,
    updateGrupoImpressao,
    deleteGrupoImpressao,
}