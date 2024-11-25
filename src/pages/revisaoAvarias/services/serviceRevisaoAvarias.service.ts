import axios from "axios"
import { iGetAvariasDestinosResponse } from "../interfaces"

const caminho = 'siap/revisaoAvarias'

type iGetAvariasDestinosFunction = () => Promise<iGetAvariasDestinosResponse[]>

const getAvariasDestinos: iGetAvariasDestinosFunction = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getAvariasDestinos'
    })

    return data;
}

export default {
    getAvariasDestinos
}