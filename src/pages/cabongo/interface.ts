export interface iParamOrcamento {
    cnpj: string,
    id_sociedade: number,
    dataOrcamentoPesquisa: string,
}

export interface iSociedadeTotalizadores {
    idSociedade: number,
    qtdOrcamentosConferidos: number,
    qtdOrcamentosPendentes: number,
}

export interface iSociedadeInicial {
    ID_EMPRESA: number,
    FANTASIA: string,
}

type iSociedadeFinal = iSociedadeTotalizadores & iSociedadeInicial;

export interface iSociedade extends iSociedadeFinal {
    loading: boolean,
    nomeEmpresa: string
}

export interface iSociedadeObj {
    [idSociedade: number]: iSociedade
}

export interface iOrcamentoData {
    DATA: string,
    QTO: number
}

export interface iParamOrcamentosData {
    cnpj: string
    id_sociedade: number,
}