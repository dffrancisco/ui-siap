export interface iFuncionario {
    COD_FUNCIONARIO: number;
    CPF: string;
    CARGO: string;
    LOGIN: string;
    NOME_COMP: string;
}

export interface iParamsValePeca {
    cod_funcionarios: number[];
    ano: number;
    DATA_ORCAMENTO?: string;
    MES?: number;
    VALOR?: number;
    NUM_ORCAMENTO?: number;
    numOrcamento?: string;
    data?: Date;
}

export interface iResponseOrcamento {
    num_Orcamento: number[];
    data: Date;
    NUM_ORCAMENTO?: number;
    NOME_CLIENTE?: string;
    VENDEDOR?: string;
    CAIXA?: string;
    DATA?: string;
    HORA?: string;
    DESCONTO?: number;
    VALOR_DESCONTO?: number;
    VALOR?: number;
    MES?: number;

}

export interface iParamsItemOrcamento {
    num_Orcamento: number[];
    data: Date;
    NUM_FABRICANTE?: string;
    DESC_PRODUTO?: string;
    UNIDADE?: string;
    DESCRICAO?: string;
    QTO?: number;
    VALOR?: number;
    VALOR_REAL?: number;
}

export interface iResponseVale {
    ID_VALE_PECA: number;
    COD_FUNCIONARIO: number;
    V_NOME_FUNCIONARIO: string;
    NUM_ORCAMENTO: number;
    VALOR: number;
    DIV: string;
    DATA_ORCAMENTO: string;
    DATA: string;
    MES: number;
    ANO: number;
}