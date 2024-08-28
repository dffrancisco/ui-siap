import axios from "axios";
import {
    iDeleteNaturezaOperacaoResponse,
    iGetDuplicidadeParam, iGetDuplicidadeResponse, iGetNaturezaOperacaoGrid, iGetNaturezaOperacaoResponse,
    iInsertNaturezaOperacaoParam, iInsertNaturezaOperacaoResponse, iUpdateNaturezaOperacaoParam,
    iUpdateNaturezaOperacaoResponse
} from "../interfaces";

const caminho = 'siap/naturezaOperacao'

type iGetNaturezaOperacaoFunction = ({ param, offset }: iGetNaturezaOperacaoGrid) =>
    Promise<iGetNaturezaOperacaoResponse>

type iInsertNaturezaOperacaoFunction = (param: iInsertNaturezaOperacaoParam) =>
    Promise<iInsertNaturezaOperacaoResponse>

type iGetDuplicidadeFunction = ({ value, field }: iGetDuplicidadeParam) => Promise<iGetDuplicidadeResponse>

type iUpdateNaturezaOperacaoFunction = (param: iUpdateNaturezaOperacaoParam) =>
    Promise<iUpdateNaturezaOperacaoResponse>

type iDeleteNaturezaOperacaoFunction = (ID_NATUREZA_OPERACAO: number) =>
    Promise<iDeleteNaturezaOperacaoResponse>

const getNaturezaOperacao: iGetNaturezaOperacaoFunction = async ({ param, offset }) => {
    let { data } = await axios.post(caminho, {
        call: 'getNaturezaOperacao',
        param,
        offset
    })
    return data
}

const insertNaturezaOperacao: iInsertNaturezaOperacaoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'insertNaturezaOperacao',
        param
    })
    return data
}

const getDuplicidade: iGetDuplicidadeFunction = async ({ value, field }) => {
    let { data } = await axios.post(caminho, {
        call: 'getDuplicidade',
        value,
        field
    })
    return data
}

const updateNaturezaOperacao: iUpdateNaturezaOperacaoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'updateNaturezaOperacao',
        param
    })
    return data
}

const deleteNaturezaOperacao: iDeleteNaturezaOperacaoFunction = async (ID_NATUREZA_OPERACAO) => {
    let { data } = await axios.post(caminho, {
        call: 'deleteNaturezaOperacao',
        ID_NATUREZA_OPERACAO
    })
    return data
}

export default {
    getNaturezaOperacao,
    insertNaturezaOperacao,
    getDuplicidade,
    updateNaturezaOperacao,
    deleteNaturezaOperacao,
}

