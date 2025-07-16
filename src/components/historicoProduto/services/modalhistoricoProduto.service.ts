import axios from "axios";
import { iComprasHistoricoProduto, iDevolucoesHistoricoProduto, iEntradasHistoricoProduto, iLogEstoquesNew, iDadosIniciaisHistoricosProdutos, iSaidasHistoricoProduto, paramEstoque, paramDadosIniciais, paramDevolucao, paramCompras, paramSaidas, paramEntradas } from "../interface";

type iGetEntradasHistoricoFunction = (param: paramEntradas) => Promise<iEntradasHistoricoProduto[]>;
type iGetSaidasHistoricoProdutoFunction = (param: paramSaidas) => Promise<iSaidasHistoricoProduto[]>;
type iGetComprasHistoricoProdutoFunction = (param: paramCompras) => Promise<iComprasHistoricoProduto[]>;
type iGetDevolucoesHistoricoProdutoFunction = (param: paramDevolucao) => Promise<iDevolucoesHistoricoProduto[]>;
type iGetLogEstoquesNewHistoricoProdutoFunction = (param: paramEstoque) => Promise<iLogEstoquesNew[]>;
type iGetMesesHistoricoProdutoFunction = (param: paramDadosIniciais) => Promise<iDadosIniciaisHistoricosProdutos>


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
const getOrcamento = async (numOrcamento: number, dataOrcamento: string) => {
    let { data } = await axios.post('siap/historicoProduto', {
        call: 'getOrcamento',
        param: {
            numOrcamento,
            dataOrcamento
        }
    })
    return data
}
const getItensOrcamento = async (numOrcamento: number, dataOrcamento: string) => {
    let { data } = await axios.post('siap/historicoProduto', {
        call: 'getItensOrcamento',
        param: {
            numOrcamento,
            dataOrcamento
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
