import axios from "axios"
import { iGetLojasResponse } from "../interfaces"

const caminho = 'siap/telaCPD'
type iGetLojasFunction = () => Promise<iGetLojasResponse[]>

const getLojas: iGetLojasFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getLojas'
    })
    console.log(data)
    return data;
}

export default {
    getLojas,
}