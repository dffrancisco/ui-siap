
export interface iParams {
    mes: number;
    ano: number;
    avaliadores?: number[];
    avaliados?: number[];
    produtos?: string[];
    situacao?: string;
    pontuacaoMinima?: number;
    page: number;
    itemsPerPage: number;
    id_sociedade: string;
    ax: string;
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

export interface iColumnPrint {
    key: string;
    label: string;
    width: string;
    align: 'left';
}

export interface iResponseRelatorio {
    dadosRelatorio: iDadosAvaliacao[];
    totalDadosRelatorio: iCount[];
}
