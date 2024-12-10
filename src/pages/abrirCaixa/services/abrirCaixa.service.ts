import axios from "axios";
import { iDadosAbrirCaixa } from "../interfaces";
type iGetDadosAbrirCaixa = () => Promise<iDadosAbrirCaixa>

const caminho = 'siap/abrirCaixa'

const getDadosAbrirCaixa: iGetDadosAbrirCaixa = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosAbrirCaixa"
    })
    return data;
}

const abrirMDC = async () => {
    let { data } = await axios.post(caminho, {
        call: "abrirMDC"
    })
    return data;
}

export default {
    getDadosAbrirCaixa,
    abrirMDC
}