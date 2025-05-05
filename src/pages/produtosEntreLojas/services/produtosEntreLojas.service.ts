import axios from "axios";
import { iGetLojasResponse, iGetProdutosEntreLojasParam, iGetProdutosEntreLojasResponse } from "../interfaces";

const caminho = 'siap/produtosEntreLojas'

type iGetLojasFunction = () => Promise<iGetLojasResponse[]>
type iGetProdutosEntreLojasFunction = (param: iGetProdutosEntreLojasParam, lojas: number[]) =>
    Promise<iGetProdutosEntreLojasResponse>

const getLojas: iGetLojasFunction = async () => {
    const { data } = await axios.post(caminho, {
        call: 'getLojas'
    })

    return data
}

const getProdutosEntreLojas: iGetProdutosEntreLojasFunction = async (param, lojas) => {
    const { data } = await axios.post(caminho, {
        call: 'getProdutosEntreLojas',
        param,
        lojas
    })

    return data
}

export default {
    getLojas,
    getProdutosEntreLojas
}