import axios from "axios";
import { iFuncionario, iGetMesEAno } from "../interface";

const caminho = 'siap/gerenciarFolhaPonto'

type iGetFuncionariosFunction = (param: iGetMesEAno) => Promise<object>

const getFuncionarios: iGetFuncionariosFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'getFuncionarios',
        param
    })

    return data;
}


export default {
    getFuncionarios
}