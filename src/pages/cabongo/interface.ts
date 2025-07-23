export interface iParamOrcamento {
    cnpj: string,
    id_sociedade: number,
    dataOrcamentoPesquisa: string,
}

export interface iOrcamento {
    idSociedade: number,
    qtdOrcamentosConferidos: number,
    qtdOrcamentosPendentes: number,
    ID_EMPRESA: number,
    FANTASIA: string
}

export interface iParamOrcamentoData {
    cnpj: string
}

export interface iOrcamentosData {
    DATA: string,
    QTO: number
}