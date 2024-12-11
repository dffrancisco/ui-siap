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
    COD_FUNCIONARIO: number;
    LOGIN: string;
    STATUS: number
}

export interface iGetDadosCaixa {
    mdc: iMdc | null;
    funcionarios: iFuncionarios[];
    caixasEmAberto: iCaixasAbertos[];
}

export interface iParamsAbrirCaixa {
    COD_FUNCIONARIO: number;
    LOGIN: string;
    VALOR_TROCO: number;
}

export interface iParamFecharCaixa {
    ID_ABERTURA_CAIXA: number;
}