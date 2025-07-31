import axios from "axios";
import { iDadosDevolucao } from "../interfaces";
const caminho = 'siap/devolucaoManualCaixa'
type iGetDadosDevolucao = (param: string) => Promise<iDadosDevolucao>

const getCaixaDiario = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCaixaDiario",
    });
    return data;
}

const getDadosDevolucao: iGetDadosDevolucao = async (idDevolucao: string) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosDevolucao",
        param: {
            idDevolucao
        }
    });
    return data;
}

const onClickLancamento = async (codCaixa, idAberturaCaixa, idDevolucaoSql, caixa) => {
    let { data } = await axios.post(caminho, {
        call: "onClickLancamento",
        param: {
            codCaixa, idAberturaCaixa, idDevolucaoSql, caixa
        }
    });
    return data;
}

export default { getCaixaDiario, getDadosDevolucao, onClickLancamento }