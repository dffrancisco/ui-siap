export interface iOptions {
    value: string;
    label: string;
}

export interface iMDC {
    STATUS: string;
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
    ID_ABERTURA_CAIXA: number;
    LOGIN: string;
    NOME_COMP: string;
    OBS: string | null;
    SANGRIA: number;
    STATUS: number;
    TROCO: number;
    DINHEIRO_LIQUIDO: number;
}

export interface iDadosOrcamento {
    NUM_ORCAMENTO: number;
    VALOR_ORCAMENTO: number;
}

export interface iTiposPagamento {
    AUTORIZACAO: string | null;
    BANDEIRA: string | null;
    CONTA_DEPOSITO: string | null;
    CONTROLE_DEPOSITO: string | null;
    DEBITO_CREDITO: string | null;
    DESCRICAO_BANDEIRA: string | null;
    DESCRICAO_PAGAMENTO: string | null;
    DIVIDE: number | null;
    OBS: string | null;
    PIX_CONTROLE: string | null;
    TIPO_PAGAMENTO: string | null;
    NUM_ORCAMENTO: number;
    VALOR: number | null;
}

export interface iTodasAsCompras {
    CAIXA: number;
    ORCAMENTOS: iDadosOrcamento[];
    DATA: string;
    ENTREGAR_RECEBER: boolean;
    HORA: string;
    NOSSO_NUM: number | null;
    TIPOS_PAGAMENTO: iTiposPagamento[];
    VALOR_TOTAL: number;
    VALOR_FILTRADO?: number;
    PAGAMENTOS_CONFERIDOS?: any[];
}

export interface iTotalizadores {
    DESCRICAO_PAGAMENTO: string;
    VALOR: number;
    TIPO_PAGAMENTO: string;
}

export interface iDevolucoes {
    CAIXA: string;
    COD_FUNCIONARIO: number;
    CODIGO: string;
    DESC_DEVOLUCAO: string;
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
    COD_FUNCIONARIO: number;
}

export interface iResponseDadosIniciais {
    mdc: iMDC[];
    funcionarios: iFuncionarios[];
    caixas: iCaixas[];
    comprasAgrupadas: iTodasAsCompras[];
    totalizadores: iTotalizadores[];
    devolucoes: iDevolucoes[];
    sangrias: iSangrias[];
    totalizadoresAgrupadosPorCaixa: iTotalizadoresAgrupados[];
}

export interface iParamsAbrirCaixa {
    COD_FUNCIONARIO: number;
    LOGIN: string;
    VALOR_TROCO: number;
}

export interface iParamFecharCaixa {
    ID_ABERTURA_CAIXA: number;
    DATA: string;
}

export interface iParamSangria {
    loginCaixa: string;
    idAberturaCaixa: number;
    valor: number;
}

export interface iTotalizadorIndividual {
    COD_FUNCIONARIO: number;
    TIPO_PAGAMENTO: string;
    DESCRICAO_PAGAMENTO: string;
    VALOR: number;
}

export interface iTotalizadoresAgrupados {
    [codFuncionario: number]: iTotalizadores[];
}

export interface iParamObs {
    idAberturaCaixa: number;
    observacao: string;
}