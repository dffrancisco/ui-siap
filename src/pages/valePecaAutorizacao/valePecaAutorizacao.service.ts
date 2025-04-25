import axios from "axios";
import { iFuncionario } from "./interfaces";

const caminho = 'siap/valePecaAutorizacao'

type iGetFuncionariosFunction = () => Promise<iFuncionario[]>

const getFuncionarios: iGetFuncionariosFunction = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getFuncionarios'
    })

    return data
}

export default {
    getFuncionarios
}