export interface iCliente {
    ID_CLIENTE: number;
    CLIENTE: string;
    CNPJ: string;
    BLOQUEADO: number;
    CREDITO_USADO: string;
    FATURADO: string;
    LIMITE_CREDITO: string;
    DIA_VENCIMENTO_BOLETO: number;
    TIPO_FATURAMENTO: string;
    DIVIDIR_BOLETO: string;
}

export interface iParamGetCliente {
    offset: number;
    param: object
}

export interface iParamDetalhesCliente {
    offset: number;
    param: object
}

export interface iGetClientesResponse extends iCliente { }

export interface iTabs {
    liberacoes: string
    bloqueiosDesbloqueios: string;
    compras: string;
    boletos: string;
}

export interface iParamUpdateCliente {
    idCliente: number;
    creditoLimiteAtual: string;
    creditoLimiteNovo: string | number;
    diaVencimento: string;
    divideBoleto: "S" | "N";
    tipoCompra: 0 | 1;
    tipoFaturamento: "Q" | "M";
}

export interface iResetStates extends iCliente {
}

export interface iLiberarLimiteResponse {
    msg: string;
    success: boolean;
    valorLiberado: number;
}