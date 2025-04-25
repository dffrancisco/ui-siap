import axios from "axios";
import { iFuncionario, iOrcamento, iValeFuncionario } from "./interfaces";

const caminho = 'siap/valePecaAutorizacao'

type iGetFuncionariosFunction = () => Promise<iFuncionario[]>
type iGetValesFuncionarioFunction = (codFuncionario: number) => Promise<iValeFuncionario[]>
type iGetOrcamentoFunction = (orc: number) => Promise<iOrcamento>

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

export default {
    getFuncionarios,
    getValesFuncionario,
    getOrcamento
}