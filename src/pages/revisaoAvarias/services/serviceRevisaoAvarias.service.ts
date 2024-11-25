import axios from "axios"
import { iGetTiposDestinosResponse } from "../interfaces"

const caminho = 'siap/revisaoAvarias'

type iGetTiposDestinosFunction = () => Promise<iGetTiposDestinosResponse[]>

const getTiposDestinos: iGetTiposDestinosFunction = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getTiposDestinos'
    })

    return data;
}

export default {
    getTiposDestinos
}