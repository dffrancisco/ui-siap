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