import axios from "axios";
import { iOrcamentoLoja, iOrcamentosObj, iParamOrcamentosLoja } from "../interface";

const caminho = 'taap/cabongoOrcamento'

type igetOrcamentosLojaFunction = (param: iParamOrcamentosLoja) => Promise<iOrcamentoLoja>;

const getOrcamentoLoja: igetOrcamentosLojaFunction = async ({ id_sociedade, cnpj, dataOrcamento }) => {
    let { data } = await axios.post(caminho, {
        call: 'getOrcamentoLoja',
        id_sociedade,
        param: {
            cnpj,
            dataOrcamento
        }
    })
    return data
}

const getQuantidadeProduto = async ({ cod_produto }) => {
    let { data } = await axios.post(caminho, {
        call: 'getQuantidadeProdutos',
        param: {
            cod_produto
        }
    })
    return data
}


export default {
    getOrcamentoLoja,
    getQuantidadeProduto
}