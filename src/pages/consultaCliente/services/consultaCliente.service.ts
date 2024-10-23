import axios from "axios";
import {
    iBoletosAbertos, iBoletosAtrasados, iBoletosComprasFaturadas, iBoletosEmDia,
    iClientes, iDetalhesCredito, iDetalhesDevolucao, iDetalhesItensMarca, iDetalhesItensOrcamento, iDetalhesOrcamento,
    iGetClientes, iParamComprasFaturadas, iParamDetalhesCredito, iParamDetalhesDevolucao, iParamDetalhesItensOrc,
    iParamDetalhesOrc, iParamItensMarca, iParamRequisicoes, iResponseDadosCliente,
    iTodosBoletos
} from "../interfaces";

const caminho = 'siap/consultaCliente'

type iGetClientesFuction = (param: iGetClientes, offset: number) => Promise<iClientes>
type iGetDadosClienteFunction = (param: iParamRequisicoes) => Promise<iResponseDadosCliente>
type iGetBoletosEmAbertoFunction = (param: number) => Promise<iBoletosAbertos[]>
type iGetBoletosAtrasadosFunction = (param: number) => Promise<iBoletosAtrasados[]>
type iGetBoletosEmDiaFunction = (param: number) => Promise<iBoletosEmDia[]>
type iGetTodosBoletosFunction = (param: number) => Promise<iTodosBoletos[]>
type iGetDetalhesOrcamentoFunction = (param: iParamDetalhesOrc) => Promise<iDetalhesOrcamento>
type iGetDetalhesItensOrcamentoFunction = (param: iParamDetalhesItensOrc) => Promise<iDetalhesItensOrcamento[]>
type iGetBoletosComprasFaturadasFunction = (param: iParamComprasFaturadas) => Promise<iBoletosComprasFaturadas[]>
type iGetDetalhesItensMarca = (param: iParamItensMarca) => Promise<iDetalhesItensMarca[]>
type iGetDetalhesCredito = (param: iParamDetalhesCredito) => Promise<iDetalhesCredito>
type iGetDetalhesDevolucao = (param: iParamDetalhesDevolucao) => Promise<iDetalhesDevolucao[]>

const getClientes: iGetClientesFuction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getClientes",
        offset,
        param
    });

    return data;
}

const requisicoesDadosCliente: iGetDadosClienteFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "requisicoesDadosCliente",
        param
    });

    return data;
}

const getBoletosEmAberto: iGetBoletosEmAbertoFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getBoletosEmAberto",
        param
    });

    return data;
}

const getBoletosAtrasados: iGetBoletosAtrasadosFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getBoletosAtrasados",
        param
    });

    return data;
}

const getBoletosEmDia: iGetBoletosEmDiaFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getBoletosEmDia",
        param
    });

    return data;
}

const getTodosBoletos: iGetTodosBoletosFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getTodosBoletos",
        param
    });

    return data;
}

const getDetalhesOrcamento: iGetDetalhesOrcamentoFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getDetalhesOrcamento",
        param
    });

    return data;
}

const getDetalhesItensOrcamento: iGetDetalhesItensOrcamentoFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getDetalhesItensOrcamento",
        param
    });

    return data;
}

const getBoletosComprasFaturadas: iGetBoletosComprasFaturadasFunction = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getBoletosComprasFaturadas",
        param
    });

    return data;
}

const getDetalhesItensMarca: iGetDetalhesItensMarca = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getDetalhesItensMarca",
        param
    });

    return data;
}

const getDetalhesCredito: iGetDetalhesCredito = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getDetalhesCredito",
        param
    });

    return data;
}

const getDetalhesDevolucao: iGetDetalhesDevolucao = async (param) => {
    const { data } = await axios.post(caminho, {
        call: "getDetalhesDevolucao",
        param
    });

    return data;
}

export default {
    getClientes,
    requisicoesDadosCliente,
    getBoletosEmAberto,
    getBoletosAtrasados,
    getBoletosEmDia,
    getTodosBoletos,
    getDetalhesOrcamento,
    getDetalhesItensOrcamento,
    getBoletosComprasFaturadas,
    getDetalhesItensMarca,
    getDetalhesCredito,
    getDetalhesDevolucao
}