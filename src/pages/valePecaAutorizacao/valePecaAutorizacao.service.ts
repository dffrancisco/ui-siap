import axios from "axios";
import { iFuncionario, iValeFuncionario } from "./interfaces";

const caminho = 'siap/valePecaAutorizacao'

type iGetFuncionariosFunction = () => Promise<iFuncionario[]>
type iGetValesFuncionarioFunction = (codFuncionario: number) => Promise<iValeFuncionario[]>

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

export default {
    getFuncionarios,
    getValesFuncionario
}