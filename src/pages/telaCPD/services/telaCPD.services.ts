import axios from "axios"
import { iGetLojasResponse } from "../interfaces"

const caminho = 'taap/telaCPD'
type iGetLojasFunction = () => Promise<iGetLojasResponse[]>

const getLojas: iGetLojasFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getLojas'
    })
    return data;
}

export default {
    getLojas,
}