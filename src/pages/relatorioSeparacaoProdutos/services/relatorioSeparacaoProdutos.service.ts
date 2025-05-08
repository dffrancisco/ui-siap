import axios from "axios";

const caminho = 'siap/relatorioSeparacaoProdutos'
type iGetEstoquistas = () => Promise<any[]>
type iGetDadosRelatorioSeparacaoProdutos = (param) => Promise<any[]>

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