export interface iOptions {
    value: string;
    label: string;
}

export interface iMDC {
    STATOS: string;
    DATA: string;
    OPEN_CLOSE: string;
}

export interface iFuncionarios {
    COD_FUNCIONARIO: number;
    LOGIN: string;
}

export interface iCaixas {
    COD_FUNCIONARIO: number;
    CONFERIDO: string;
    CPF: string;
    DATA_ABERTURA: string;
    DEVOLUCAO: number;
    DINHEIRO: number;
    HORA_ABERTURA: string;
    HORA_FECHAMENTO: string;
    ID_ABERTURA_CAIXA: string;
    LOGIN: string;
    OBS: string;
    SANGRIA: number;
    STATUS: number;
    TROCO: number;
}

export interface iResponseDadosIniciais {
    mdc: iMDC[];
    funcionarios: iFuncionarios[];
    caixas: any[];
}

export interface iParamsAbrirCaixa {
    COD_FUNCIONARIO: number;
    LOGIN: string;
    VALOR_TROCO: number;
}

export interface iParamFecharCaixa {
    ID_ABERTURA_CAIXA: number;
}