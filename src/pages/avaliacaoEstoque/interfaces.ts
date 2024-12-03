export interface iParamsRelatorio {
    mes: number;
    ano: number | string;
    avaliadores?: number[];
    avaliados?: number[];
    page: number;
    itemsPerPage: number;
}

export interface iDadosAvaliacao {
    ID_AVALIACAO: number;
    DT_AVALIACAO: string;
    COR_CORREDOR: string;
    NT_PONTUACAO: number;
    AVALIADO: string;
    AVALIADOR: string;
    ST_SITUACAO: string;
}

export interface iCount {
    TOTAL: number;
}


export interface iResponseRelatorio {
    dadosRelatorio: iDadosAvaliacao[];
    totalDadosRelatorio: iCount[];
}