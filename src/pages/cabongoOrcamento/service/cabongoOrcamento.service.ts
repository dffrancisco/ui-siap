import axios from "axios";
import { iOrcamentosLoja, iParamOrcamentosLoja } from "../interface";

const caminho = 'siap/cabongoOrcamento'

type igetOrcamentosLojaFunction = (param: iParamOrcamentosLoja) => Promise<iOrcamentosLoja>;

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

const getOrcamentoItens = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getOrcamentoItens',

    })

}

export default {
    getOrcamentoLoja
}