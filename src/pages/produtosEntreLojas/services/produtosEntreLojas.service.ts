import axios from "axios";
import { iGetLojasResponse, iGetOrcamentosProdutoEntreLojasParam, iGetOrcamentosProdutoEntreLojasResponse, iGetProdutosEntreLojasParam, iGetProdutosEntreLojasResponse } from "../interfaces";

const caminho = 'siap/produtosEntreLojas'

type iGetLojasFunction = () => Promise<iGetLojasResponse[]>
type iGetProdutosEntreLojasFunction = (param: iGetProdutosEntreLojasParam, lojas: number[]) =>
    Promise<iGetProdutosEntreLojasResponse>
type iGetOrcamentosProdutoEntreLojasFunction = (param: iGetOrcamentosProdutoEntreLojasParam, loja: number) =>
    Promise<iGetOrcamentosProdutoEntreLojasResponse[]>

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

const getOrcamentosProdutoEntreLojas: iGetOrcamentosProdutoEntreLojasFunction = async (param, loja) => {
    const { data } = await axios.post(caminho, {
        call: 'getOrcamentosProdutoEntreLojas',
        param,
        loja
    })

    return data
}

export default {
    getLojas,
    getProdutosEntreLojas,
    getOrcamentosProdutoEntreLojas
}