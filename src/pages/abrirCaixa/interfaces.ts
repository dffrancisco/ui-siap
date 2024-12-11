export interface iMdc {
    DATA: string;
    OPEN_CLOSE: string;
    STATOS: string;
}

export interface iFuncionarios {
    COD_FUNCIONARIO: number;
    LOGIN: string;
}

export interface iCaixasAbertos {
    CPF: string;
    HORA_ABERTURA: string;
    HORA_FECHAMENTO: string;
    ID_ABERTURA_CAIXA: string;
    LOGIN: string;
    STATUS: number
}

export interface iGetDadosCaixa {
    mdc: iMdc | null;
    funcionarios: iFuncionarios[];
    caixasAbertos: iCaixasAbertos[];
}

export interface iParamsAbrirCaixa {
    COD_FUNCIONARIO: number;
    LOGIN: string;
    VALOR_TROCO: number;
}