import axios from "axios";
import { iComprasHistoricoProduto, iDevolucoesHistoricoProduto, iEntradasHistoricoProduto, iLogEstoquesNew, iDadosIniciaisHistoricosProdutos, iSaidasHistoricoProduto } from "../interface";

type iGetEntradasHistoricoFunction = (param: iEntradasHistoricoProduto) => Promise<iEntradasHistoricoProduto[]>;
type iGetSaidasHistoricoProdutoFunction = (param: iSaidasHistoricoProduto) => Promise<iSaidasHistoricoProduto[]>;
type iGetComprasHistoricoProdutoFunction = (param: iComprasHistoricoProduto) => Promise<iComprasHistoricoProduto[]>;
type iGetDevolucoesHistoricoProdutoFunction = (param: iDevolucoesHistoricoProduto) => Promise<iDevolucoesHistoricoProduto[]>;
type iGetLogEstoquesNewHistoricoProdutoFunction = (param: iLogEstoquesNew) => Promise<iLogEstoquesNew[]>;
type iGetMesesHistoricoProdutoFunction = (param: iDadosIniciaisHistoricosProdutos) => Promise<iDadosIniciaisHistoricosProdutos>


const getEntradas: iGetEntradasHistoricoFunction = async (param) => {
    let { data } = await axios.post('siap/historicoProduto', {
        call: 'getEntradas',
        param
    });

    return data;
}

const getSaidas: iGetSaidasHistoricoProdutoFunction = async (param) => {
    let { data } = await axios.post('siap/historicoProduto', {
        call: 'getSaidas',
        param
    })

    return data
}

const getCompras: iGetComprasHistoricoProdutoFunction = async (param) => {
    let { data } = await axios.post('siap/historicoProduto', {
        call: 'getCompras',
        param
    })
    return data
}
const getDevolucoes: iGetDevolucoesHistoricoProdutoFunction = async (param) => {
    let { data } = await axios.post('siap/historicoProduto', {
        call: 'getDevolucoes',
        param
    })
    return data
}
const getLogEstoquesNew: iGetLogEstoquesNewHistoricoProdutoFunction = async (param) => {
    let { data } = await axios.post('siap/historicoProduto', {
        call: 'getLogEstoquesNew',
        param
    })
    return data
}
const getDadosIniciais: iGetMesesHistoricoProdutoFunction = async (param) => {
    let { data } = await axios.post('siap/historicoProduto', {
        call: 'getDadosIniciais',
        param
    });

    return data;
}
const getOrcamento = async (NUM_ORCAMENTO: number, DATA: string) => {
    let { data } = await axios.post('siap/historicoProduto', {
        call: 'getOrcamento',
        param: {
            NUM_ORCAMENTO,
            DATA
        }
    })
    return data
}
const getItensOrcamento = async (NUM_ORCAMENTO: number, DATA: string) => {
    let { data } = await axios.post('siap/historicoProduto', {
        call: 'getItensOrcamento',
        param: {
            NUM_ORCAMENTO,
            DATA
        }
    })
    return data
}



export default {
    getEntradas,
    getSaidas,
    getDadosIniciais,
    getCompras,
    getDevolucoes,
    getLogEstoquesNew,
    getOrcamento,
    getItensOrcamento
}
