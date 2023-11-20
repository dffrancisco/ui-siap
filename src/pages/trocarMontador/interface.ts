export interface iMontador {
    COD_FUNCIONARIO: number,
    NOME_MONTADOR: string,
    CPF: string,
}

export interface iOrcamento {
    NUM_ORCAMENTO: number,
    MES: number,
    ANO: number,
    DATA: string,
    VALOR: number,
    VALOR_MONTAGEM: number,
    ID_MONTADOR: number,
    NOME_MONTADOR: string,
    CPF: string,
    ID_ORDEMDESERVICO: number,
}

export interface iParamUpdateMontador {
    ID_MONTADOR: number,
    ID_ORDEMDESERVICO: number,
    NUM_ORCAMENTO: number,
    COD_FUNCIONARIO: number,
}
