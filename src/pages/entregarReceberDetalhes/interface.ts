export interface iGetEntregarReceberPendenteParam {
    offset: number,
    codFuncionario: number | undefined,
    idCliente: number | undefined,
    numOrcamento: number | undefined,
}

export interface iEntregarReceber {
    NUM_ORCAMENTO: number,
    DATA: string,
    HORA: string,
    TIPO_PAGAMENTO: string,
    COD_FUNCIONARIO_MOTORISTA: number,
    NOME_MOTORISTA: string | null,
    CPF: string,
    VALOR: number,
    ID_CLIENTE: number,
    CLIENTE: string,
    NOME_CLIENTE: string,
    ID_EMPRESA: number,
    VENDEDOR: string,
    DESCRICAO_PAGAMENTO: string,
    OBSERVACAO: string,
}

export interface iMotorista {
    COD_FUNCIONARIO: number,
    CPF: string,
    NOME_MOTORISTA: string,
}

export interface iOrcamentoBaixa {
    NUM_ORCAMENTO: number,
    DATA: string,
    TIPO_PAGAMENTO: string,
    DESCRICAO_PAGAMENTO: string | undefined,
    VALOR: number,
    CLIENTE: string | undefined,
    NOME_MOTORISTA: string | undefined,
}

export interface iTrocarMotoristaFunctionParam {
    codFuncionario: number,
    numOrcamento: number,
    data: string,
}

export interface iInsertUpdateObsEntregarReceberFunctionParam {
    numOrcamento: number,
    data: string,
    obs: string,
}

export interface iUpdateDescPendenciaMotoristaFunctionParam {
    numOrcamento: number,
    data: string,
    descPendencia: string,
}

export interface iGetOrcamentosBaixaFunctionParam {
    numOrcamento: number,
    data: string | undefined,
}