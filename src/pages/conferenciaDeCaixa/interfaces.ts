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

export interface iTodasAsCompras {
    AUTORIZACAO: string | null;
    BANDEIRA: string | null;
    DATA: string | null;
    DESCONTO: number | null;
    DESCRICAO_PAGAMENTO: string | null;
    HORA: string;
    NOSSO_NUM: number | null;
    NUM_ORCAMENTO: number | null;
    TIPO_PAGAMENTO: string | null;
    VALOR: number | null;
    DADOS_ORCAMENTO: { NUM: number, VL: number }[];
    TP: { DESCRICAO_PAGAMENTO: string, VALOR: number, TIPO_PAGAMENTO: string }[];
}

export interface iValoresRecebidos {
    DESCRICAO_PAGAMENTO: string;
    VALOR: number;
    TIPO_PAGAMENTO: string;
}

export interface iResponseDadosIniciais {
    mdc: iMDC[];
    funcionarios: iFuncionarios[];
    caixas: iCaixas[];
    comprasAgrupadas: iTodasAsCompras[];
    valoresRecebidosAll: iValoresRecebidos[];
}

export interface iParamsAbrirCaixa {
    COD_FUNCIONARIO: number;
    LOGIN: string;
    VALOR_TROCO: number;
}

export interface iParamFecharCaixa {
    ID_ABERTURA_CAIXA: number;
}