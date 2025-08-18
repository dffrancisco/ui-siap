import axios from "axios";
import { iDadosDevolucao, Mensagem } from "../interfaces";
const caminho = 'siap/devolucaoManualCaixa'
type iGetDadosDevolucao = (param: number) => Promise<iDadosDevolucao>

const getCaixaDiario = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCaixaDiario",
    });
    return data;
}

const getDadosDevolucao: iGetDadosDevolucao = async (idDevolucao: number) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosDevolucao",
        param: {
            idDevolucao
        }
    });
    return data;
}

const onClickLancamento = async (codCaixa: number, idAberturaCaixa: number, idDevolucao: number, caixa: string): Promise<Mensagem> => {
    let { data } = await axios.post(caminho, {
        call: "onClickLancamento",
        param: {
            codCaixa, idAberturaCaixa, idDevolucao, caixa
        }
    });
    return data;
}

export default { getCaixaDiario, getDadosDevolucao, onClickLancamento }