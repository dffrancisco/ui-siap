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

export interface iTiposPagamento {
    AUTORIZACAO: string | null;
    BANDEIRA: string | null;
    DESCRICAO_BANDEIRA: string | null;
    DESCRICAO_PAGAMENTO: string | null;
    DIVIDE: number | null;
    PIX_CONTROLE: string | null;
    TIPO: string | null;
    TIPO_PAGAMENTO: string;
    VALOR: number;
    OBS: string | null;
}

export interface iTodasAsCompras {
    id: number;
    AUTORIZACAO: string | null;
    BANDEIRA: string | null;
    DATA: string | null;
    DESCONTO: number | null;
    DESCRICAO_PAGAMENTO: string | null;
    DESCRICAO_BANDEIRA: string | null;
    DIVIDE: number | null;
    HORA: string;
    NOSSO_NUM: number | null;
    NUM_ORCAMENTO: number | null | string;
    PIX_CONTROLE: string | null;
    PIX_VALOR: number | null;
    TIPO_PAGAMENTO: string | null;
    TIPO: string | null;
    VALOR: number | null;
    VALOR_CARTAO: number | null;
    DADOS_ORCAMENTO: { NUM: number, VL: number }[];
    TP: iTiposPagamento[];
}

export interface iValoresRecebidos {
    DESCRICAO_PAGAMENTO: string;
    VALOR: number;
    TIPO_PAGAMENTO: string;
}

export interface iDevolucoes {
    CAIXA: string;
    CODIGO: string;
    DESCRICAO_PAGAMENTO: string;
    LOGIN: string;
    NUM_ORCAMENTO: number;
    VALOR: number;
}

export interface iSangrias {
    ENTREGUE_PARA: string;
    HORA: string;
    LOGIN: string;
    VALOR: number;
}

export interface iResponseDadosIniciais {
    mdc: iMDC[];
    funcionarios: iFuncionarios[];
    caixas: iCaixas[];
    comprasAgrupadas: iTodasAsCompras[];
    valoresRecebidosAll: iValoresRecebidos[];
    devolucoesAll: iDevolucoes[];
    sangriasAll: iSangrias[];
}

export interface iParamsAbrirCaixa {
    COD_FUNCIONARIO: number;
    LOGIN: string;
    VALOR_TROCO: number;
}

export interface iParamFecharCaixa {
    ID_ABERTURA_CAIXA: number;
}