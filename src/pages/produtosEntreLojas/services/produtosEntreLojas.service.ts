import axios from "axios";
import { iGetLojasResponse } from "../interfaces";

const caminho = 'siap/produtosEntreLojas'

type iGetLojasFunction = () => Promise<iGetLojasResponse[]>

const getLojas: iGetLojasFunction = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getLojas'
    })

    return data
}

export default {
    getLojas
}