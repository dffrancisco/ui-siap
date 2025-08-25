import axios from "axios";
import { iMontador, iOrcamento, iParamUpdateMontador } from "../interface";

const caminho = 'taap/trocarMontador'

type iGetMontadoresFunction = () => Promise<iMontador[]>
type iGetOrcamentoFunction = (numOrcamento: number) => Promise<iOrcamento>
type iUpdateMontadorFunction = (param: iParamUpdateMontador) => Promise<iOrcamento>

const getMontadores: iGetMontadoresFunction = async () => {
    let { data } = await axios.post(caminho, {
        call: 'getMontadores'
    })

    return data;
}

const getOrcamento: iGetOrcamentoFunction = async (numOrcamento: number) => {
    let { data } = await axios.post(caminho, {
        call: 'getOrcamento',
        param: {
            NUM_ORCAMENTO: numOrcamento
        },
    })

    return data;
}

const updateMontador: iUpdateMontadorFunction = async (param) => {
    let { data } = await axios.post(caminho, {
        call: 'updateMontador',
        param: {
            ID_MONTADOR: param.ID_MONTADOR,
            ID_ORDEMDESERVICO: param.ID_ORDEMDESERVICO,
            NUM_ORCAMENTO: param.NUM_ORCAMENTO,
            COD_FUNCIONARIO: param.COD_FUNCIONARIO,
        }
    })

    return data;
}

export default {
    getMontadores,
    getOrcamento,
    updateMontador,
}