
export interface iParams {
    id_sociedade: string;
    ax: string;
    mes: number;
    ano: number;
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
