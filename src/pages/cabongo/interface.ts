export interface iParamOrcamento {
    cnpj: string,
    id_sociedade: number,
    dataOrcamentoPesquisa: string,
}

export interface iOrcamento {
    idSociedade: number,
    qtdOrcamentosConferidos: number,
    qtdOrcamentosPendentes: number,
    loading: boolean,
    ID_EMPRESA: number,
    FANTASIA: string,
    nomeEmpresa: string
}

export interface iSociedade {
    ID_EMPRESA: number,
    FANTASIA: string
}

export interface iOrcamentosData {
    DATA: string,
    QTO: number
}

export interface iParamOrcamentosData {
    cnpj: string
    id_sociedade: number,
}