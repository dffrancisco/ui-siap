usando essa service como padrão "import axios from "axios";
import { iClientes, iDadosInputs, iGetClientes, iInsertOrUpdateCliente } from "../interfaces";
type iGetDadosParaInputs = () => Promise<iDadosInputs>
type iGetClientesFuction = (param: iGetClientes, offset: number) => Promise<iClientes>
type iInsertUpdateCliente = (param: iInsertOrUpdateCliente) => Promise<any>
type iDeleteCliente = (param: number) => Promise<string>

const caminho = 'siap/cliente'

const getDadosParaInputs: iGetDadosParaInputs = async () => {
    let { data } = await axios.post(caminho, {
        call: "getDadosParaInputs",
    });
    return data;
}

const getClientes: iGetClientesFuction = async (param, offset) => {
    const { data } = await axios.post(caminho, {
        call: "getClientes",
        offset,
        param
    });

    return data;
}

const buscarCEP = async (cep: string) => {
    let data = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return data;
}

const insertOuUpdateCliente: iInsertUpdateCliente = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "insertOrUpdateCliente",
        param
    })
    return data;
}

const deletarCliente: iDeleteCliente = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "deletarCliente",
        param
    });
    return data;
}

const buscarCNAE = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "buscarCNAE",
        param
    });
    return data;
}

const verificarSeClienteExiste = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "verificarSeClienteExiste",
        param
    });
    return data;
}

const ativarCliente = async (param) => {
    let { data } = await axios.post(caminho, {
        call: "ativarCliente",
        param
    });
    return data;
}

export default {
    getDadosParaInputs,
    getClientes,
    buscarCEP,
    insertOuUpdateCliente,
    deletarCliente,
    buscarCNAE,
    verificarSeClienteExiste,
    ativarCliente
}" tendo em vista esses gets do sql "import { iConexao } from '../../db/firebirdConnect';
import {
    iParamsValePeca, iResponseVale,
    iResponseOrcamento, iParamsItemOrcamento
} from "./interfaces";

export default class SqlValePeca {
    private conexao: iConexao;
    public ID_EMPRESA: number;

    constructor(conexao: iConexao, ID_EMPRESA: number) {
        this.conexao = conexao;
        this.ID_EMPRESA = ID_EMPRESA;
    }

    async getConsultarVales(params: iParamsValePeca) {
        let where = "WHERE B.NOME_COMP IS NOT NULL AND A.VALOR > 0 AND B.DELETADO = 'N'";
        const sqlParams: Array<string | number> = [this.ID_EMPRESA];

        if (params.COD_FUNCIONARIO) {
            where += ` AND B.COD_FUNCIONARIO = ?`;
            sqlParams.push(params.COD_FUNCIONARIO);
        }
        if (params.DATA_ORCAMENTO && params.DATA) {
            where += ` AND A.DATA BETWEEN ? AND ?`;
            sqlParams.push(params.DATA_ORCAMENTO, params.DATA);
        } else if (params.DATA_ORCAMENTO) {
            where += ` AND A.DATA >= ?`;
            sqlParams.push(params.DATA_ORCAMENTO);
        } else if (params.DATA) {
            where += ` AND A.DATA <= ?`;
            sqlParams.push(params.DATA);
        }

        const sql = `
            SELECT A.COD_FUNCIONARIO, B.LOGIN AS V_NOME_FUNCIONARIO, 
                   A.DATA, A.VALOR, A.MES, A.ANO
            FROM VALE A
            LEFT JOIN FUNCIONARIO B ON B.COD_FUNCIONARIO = A.COD_FUNCIONARIO 
            ${where}
            AND A.ID_EMPRESA = ?
            ORDER BY LOGIN ASC, DATA DESC
        `;

        return this.conexao.queryParam(sql, sqlParams);
    }

    async getConsultarValePeca(params: iParamsValePeca) {
        let where = "WHERE B.NOME_COMP IS NOT NULL AND A.VALOR > 0 AND B.DELETADO = 'N'";
        const sqlParams: Array<string | number> = [this.ID_EMPRESA];

        if (params.COD_FUNCIONARIO) {
            where += ` AND B.COD_FUNCIONARIO = ?`;
            sqlParams.push(params.COD_FUNCIONARIO);
        }

        if (params.DATA_ORCAMENTO && params.DATA) {
            where += ` AND A.DATA BETWEEN ? AND ?`;
            sqlParams.push(params.DATA_ORCAMENTO, params.DATA);
        } else if (params.DATA_ORCAMENTO) {
            where += ` AND A.DATA >= ?`;
            sqlParams.push(params.DATA_ORCAMENTO);
        } else if (params.DATA) {
            where += ` AND A.DATA <= ?`;
            sqlParams.push(params.DATA);
        }

        if (params.NUM_ORCAMENTO) {
            where += ` AND A.NUM_ORCAMENTO = ?`;
            sqlParams.push(params.NUM_ORCAMENTO);
        }

        const sql = `
            SELECT A.ID_VALE_PECA, A.COD_FUNCIONARIO, B.LOGIN AS V_NOME_FUNCIONARIO,
                   A.NUM_ORCAMENTO, A.VALOR, A.DIV, A.DATA_ORCAMENTO, 
                   A.DATA, A.MES, A.ANO
            FROM VALE_PECA A
            LEFT JOIN FUNCIONARIO B ON B.COD_FUNCIONARIO = A.COD_FUNCIONARIO 
            ${where}
            AND A.ID_EMPRESA = ?
            ORDER BY LOGIN, DATA
        `;

        return this.conexao.queryParam(sql, sqlParams);
    }

    async getOrcamento(params: { NUM_ORCAMENTO: number, DATA: string }) {
        const sqlParams: Array<string | number> = [
            params.NUM_ORCAMENTO,
            this.ID_EMPRESA,
            params.DATA
        ];

        const sql = `
            SELECT A.NUM_ORCAMENTO, A.NOME_CLIENTE, B.LOGIN AS VENDEDOR,
                   C.LOGIN AS CAIXA, A.DATA, A.HORA, A.DESCONTO,
                   A.VALOR_DESCONTO, A.VALOR
            FROM CAIXA A
            LEFT JOIN FUNCIONARIO B ON B.COD_FUNCIONARIO = A.ID_VENDEDOR
            LEFT JOIN FUNCIONARIO C ON C.COD_FUNCIONARIO = A.ID_OPERADOR_CAIXA
            WHERE A.NUM_ORCAMENTO = ? 
            AND A.ID_EMPRESA = ?
            AND A.DATA = ?
        `;

        return this.conexao.queryParam(sql, sqlParams);
    }

    async getItensOrcamento(params: { NUM_ORCAMENTO: number, DATA: string }) {
        const sqlParams: Array<string | number> = [
            params.NUM_ORCAMENTO,
            this.ID_EMPRESA,
            params.DATA
        ];

        const sql = `
            SELECT B.NUM_FABRICANTE, B.DESC_PRODUTO, B.UNIDADE,
                   C.DESCRICAO, A.QTO, A.VALOR, A.VALOR_REAL
            FROM ITENS_CAIXA A
            LEFT JOIN PRODUTO B ON B.COD_PRODUTO = A.COD_PRODUTO
            LEFT JOIN CARRO C ON C.ID_CARRO = B.ID_CARRO
            WHERE A.NUM_ORCAMENTO = ? 
            AND A.ID_EMPRESA = ?
            AND A.DATA = ?
        `;

        return this.conexao.queryParam(sql, sqlParams);
    }
} " e essas interfaces "export interface iResponseVale {
    COD_FUNCIONARIO: number;
    V_NOME_FUNCIONARIO: string;
    DATA: string;
    VALOR: number;
    MES: number;
    ANO: number;
}

export interface iParamsValePeca {
    ID_VALE_PECA: number;
    COD_FUNCIONARIO: number;
    V_NOME_FUNCIONARIO: string;
    NUM_ORCAMENTO: number;
    VALOR: number;
    DIV: number;
    DATA_ORCAMENTO: string;
    DATA: string;
    MES: number;
    ANO: number;
}

export interface iResponseOrcamento {
    NUM_ORCAMENTO: number;
    NOME_CLIENTE: string;
    VENDEDOR: string;
    CAIXA: string;
    DATA: string;
    HORA: string;
    DESCONTO: number;
    VALOR_DESCONTO: number;
    VALOR: number;
}

export interface iParamsItemOrcamento {
    NUM_FABRICANTE: string;
    DESC_PRODUTO: string;
    UNIDADE: string;
    DESCRICAO: string;
    QTO: number;
    VALOR: number;
    VALOR_REAL: number;
}" defina minha services de consultaValePeças