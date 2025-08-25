import axios from "axios";
import { iEstoquistas, iRelatorioSeparacaoProdutos } from "../interfaces";

const caminho = 'taap/relatorioSeparacaoProdutos'
type iGetEstoquistas = () => Promise<iEstoquistas[]>
type iGetDadosRelatorioSeparacaoProdutos = (param) => Promise<iRelatorioSeparacaoProdutos[]>

const getEstoquistas: iGetEstoquistas = async () => {
    let { data } = await axios.post(caminho, {
        call: "getEstoquistas",
    });

    return data;
}

const getDadosRelatorioSeparacaoProdutos: iGetDadosRelatorioSeparacaoProdutos = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "getDadosRelatorioSeparacaoProdutos",
        param
    });

    return data;
}

export default {
    getEstoquistas,
    getDadosRelatorioSeparacaoProdutos,
};