export interface iResponseDadosInput {
    funcionarios: iFuncionarios[];
    lojas: iLojas[];
}

export interface iFuncionarios {
    CARGO: string;
    LOGIN: string;
    CPF: string;
    ID_CARGO: number;
    COD_FUNCIONARIO: number;
}

export interface iLojas {
    ID_EMPRESA: number;
}

export interface iResponseVales {
    codFuncionario: number;
    dataInicio: string;
    dataFim: string;
    COD_FUNCIONARIO: number;
    DATA: string;
    VALOR: number;
    DATA_PG: string | null;
    COD_FUNCIONARIO_PAGADOR: number | null;
    MES: number;
    ANO: number;
    TIPO: string;
    V_NOME_FUNCIONARIO: string;
    NOME_COMP: string;
    PAGADOR: string;
}

export interface iConsultaValeParams {
    codFuncionario: number[];
    ano: string;
}