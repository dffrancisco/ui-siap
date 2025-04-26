import axios from "axios";
import { iAutorizacaoFuncionario, iFuncionario, iGetAutorizacaoFuncionarioParam, iLiberarVale, iLiberarValeParam, iOrcamento, iValeFuncionario } from "./interfaces";

const caminho = 'siap/valePecaAutorizacao'

type iGetFuncionariosFunction = () => Promise<iFuncionario[]>
type iGetValesFuncionarioFunction = (codFuncionario: number) => Promise<iValeFuncionario[]>
type iGetOrcamentoFunction = (orc: number) => Promise<iOrcamento>
type iGetAutorizacaoFuncionarioFunction = (param: iGetAutorizacaoFuncionarioParam) =>
    Promise<iAutorizacaoFuncionario>
type iLiberarValeFunction = (param: iLiberarValeParam) => Promise<iLiberarVale>

const getFuncionarios: iGetFuncionariosFunction = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getFuncionarios'
    })

    return data
}

const getValesFuncionario: iGetValesFuncionarioFunction = async (codFuncionario) => {
    const { data } = await axios.post(caminho, {
        call: 'getValesFuncionario',
        codFuncionario
    })

    return data
}

const getOrcamento: iGetOrcamentoFunction = async (orc) => {
    const { data } = await axios.post(caminho, {
        call: 'getOrcamento',
        orc
    })

    return data
}

const getAutorizacaoFuncionario: iGetAutorizacaoFuncionarioFunction = async (param) => {
    const { data } = await axios.post(caminho,
        {
            call: 'getAutorizacaoFuncionario',
            param
        }
    )

    return data
}

const liberarVale: iLiberarValeFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: 'liberarVale',
        param
    })

    return data
}

export default {
    getFuncionarios,
    getValesFuncionario,
    getOrcamento,
    getAutorizacaoFuncionario,
    liberarVale
}