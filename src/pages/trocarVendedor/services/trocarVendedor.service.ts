import axios from "axios";
import { iOrcamento, iParamUpdateVendedor, iVendedor } from "../interfaces";

const caminho = 'siap/trocarVendedor'
type iGetOrcamentoFunction = (numOrcamento: number) => Promise<iOrcamento>
type iGetVendedoresFunction = () => Promise<iVendedor[]>
type iUpdateVendedorFunction = (param: iParamUpdateVendedor) => Promise<iOrcamento>


const getOrcamento: iGetOrcamentoFunction = async (numOrcamento: number) => {
    let { data } = await axios.post(caminho, {
        call: 'getOrcamento',
        param: {
            NUM_ORCAMENTO: numOrcamento
        },
    })

    return data;
}
const getVendedores: iGetVendedoresFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getVendedores'
    })

    return data;
}
const updateVendedor: iUpdateVendedorFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'updateVendedor',
        param: {
            NUM_ORCAMENTO: param.NUM_ORCAMENTO,
            ID_VENDEDOR: param.ID_VENDEDOR,
        }
    })

    return data;
}

export default {
    getOrcamento,
    getVendedores,
    updateVendedor,
}