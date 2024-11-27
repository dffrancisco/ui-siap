import axios from "axios"
import { iFiltro, iGetDadosToSelectsResponse, iGetAvariasResponse } from "../interfaces"

const caminho = 'siap/revisaoAvarias'

type iGetDadosToSelects = () => Promise<iGetDadosToSelectsResponse>
type iGetAvariasFunction = (filtros: iFiltro) => Promise<iGetAvariasResponse[]>

const getDadosToSelects: iGetDadosToSelects = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getDadosToSelects'
    })

    return data;
}

const getAvarias: iGetAvariasFunction = async (filtros) => {
    const { data } = await axios.post(caminho, {
        call: 'getAvarias',
        filtros
    })

    return data;
}

export default {
    getDadosToSelects,
    getAvarias
}