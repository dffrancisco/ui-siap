export interface iGetSugestaoCompraAlteracao {
    page: number;
    itemsPerPage: number;
    DATA_INICIO: string,
    DATA_FIM: string,
}

export interface iSugestaoCompraAlteracao {
    ID_PRODUTO_SUGESTAO: number;
    COD_PRODUTO: number | null,
    TIPO: string,
    COD_FUNCIONARIO: number,
    SUGESTAO: string | null,
    APROVADA: string | null,
    REVISOR: number | null,
    DATA: string | null,
    DESCRICAO_PRODUTO: string | null,
    SOLICITANTE: string | null
}

export interface iResponseSugestaoCompraAlteracao {
    sugestaoCompraAlteracao: iSugestaoCompraAlteracao[];
    total: {
        TOTAL: number;
    }[]
}

export interface iAprovarOuReprovar {
    id_produto_sugestao: number,
    aprovada: string
}

export interface iAprovar extends iAprovarOuReprovar { }

export interface iReprovar extends iAprovarOuReprovar { }