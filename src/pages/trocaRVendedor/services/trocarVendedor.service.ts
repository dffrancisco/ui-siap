import axios from "axios";
import { iOrcamento, iVendedor } from "../interfaces";

const caminho = 'taap/trocaVendedor'
type iGetOrcamentoFunction = (numOrcamento: number) => Promise<iOrcamento>
type iGetVendedoresFunction = () => Promise<iVendedor[]>


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
        call: 'getMontadores'
    })

    return data;
}

export default {
    getOrcamento,
    getVendedores,

}