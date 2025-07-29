import axios from "axios";
import { iDadosDaDevolucao } from "../interfaces";
const caminho = 'siap/devolucaoManualCaixa'
type iGetDadosDaDevolucao = (param: string) => Promise<iDadosDaDevolucao>

const getCaixasDoDia = async () => {
    let { data } = await axios.post(caminho, {
        call: "getCaixasDoDia",
    });
    return data;
}

const getDadosDaDevolucao: iGetDadosDaDevolucao = async (idDevolucao:string) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosDaDevolucao",
        param: {
            idDevolucao
        }
    });
    return data;
}

const onClickLancamento = async (idDevolucao:string) => {
    let { data } = await axios.post(caminho, {
        call: "onClickLancamento",
        param: {
            idDevolucao
        }
    });
    return data;
}

export default { getCaixasDoDia, getDadosDaDevolucao, onClickLancamento }