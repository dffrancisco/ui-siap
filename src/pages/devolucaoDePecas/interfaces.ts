export interface iParamGetDevolucoes {
    dataInicio: string;
    dataFim: string;
    tipoData: string;
}

export interface iDevolucao {
    NUM_DEVOLUCAO: number,
    NUM_ORCAMENTO: number,
    DATA: string,
    VALOR: number,
    NF_DEVOLUCAO: string,
    CREDITO: number,
    TIPOS_PAGAMENTOS: {
        DESCRICAO_PAGAMENTO: string | null;
    }[];
    LOGIN: string,
    STATUS: 'ABERTA' | 'FINALIZADA'
}

export interface iDetalhesDevolucao {
    COD_PRODUTO: number;
    QUAL_TIPO_AVARIA: string;
    MOTIVO_DEVOLUCAO: string;
    DESC_PRODUTO: string;
    DESCRICAO_PAGAMENTO: string | null;
    CREDITO: number | null | string;
}

export interface iGetDevolucoesResponse extends iDevolucao { }