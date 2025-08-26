import axios from "axios";
import { iOrcamento, iParamUpdateOrcamento, } from "../interfaces";

const caminho = 'siap/recalcularDescontoLoja'
type iGetOrcamentoFunction = (numOrcamento: number) => Promise<iOrcamento>
type iUpdateOrcamentoFunction = (param: iParamUpdateOrcamento) => Promise<iOrcamento>


const getOrcamento: iGetOrcamentoFunction = async (numOrcamento: number) => {
    let { data } = await axios.post(caminho, {
        call: 'getOrcamento',
        param: {
            NUM_ORCAMENTO: numOrcamento
        },
    })

    return data;
}

const updateOrcamento: iUpdateOrcamentoFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'updateOrcamento',
        param: {
            NUM_ORCAMENTO: param.NUM_ORCAMENTO,
        }
    })

    return data;
}

export default {
    getOrcamento,
    updateOrcamento,
}