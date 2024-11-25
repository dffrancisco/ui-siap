import axios from "axios"
import { iFiltro, iGetAvariasDestinosResponse, iGetAvariasResponse } from "../interfaces"

const caminho = 'siap/revisaoAvarias'

type iGetAvariasDestinosFunction = () => Promise<iGetAvariasDestinosResponse[]>
type iGetAvariasFunction = (filtros: iFiltro) => Promise<iGetAvariasResponse[]>

const getAvariasDestinos: iGetAvariasDestinosFunction = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getAvariasDestinos'
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
    getAvariasDestinos,
    getAvarias
}