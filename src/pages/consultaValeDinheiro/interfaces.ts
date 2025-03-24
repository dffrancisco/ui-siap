export interface iResponseDadosInput {
    funcionarios: iFuncionarios[];
    lojas: iLojas[];
}

export interface iFuncionarios {
    CARGO: string;
    LOGIN: string;
    CPF: string;
    ID_CARGO: number;
    NOME_COMP?: string;
    COD_FUNCIONARIO: number;
}

export interface iLojas {
    ID_EMPRESA: number;
}

export interface iResponseVales {
    COD_FUNCIONARIO: number;
    DATA: string;
    VALOR: number;
    DATA_PG: string;
    COD_FUNCIONARIO_PAGADOR: number;
    MES: number;
    ANO: number;
    TIPO: string;
    FORMA_PAGAMENTO: string;
    V_NOME_FUNCIONARIO: string;
    NOME_COMP: string;
    PAGADOR: string;
}
