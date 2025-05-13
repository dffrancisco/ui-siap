export interface iEstoquistas {
    LOGIN: string;
    COD_FUNCIONARIO: number;
    DESCRICAO: string
    LOGIN_COM_CODIGO: string;
}

export interface iRelatorioSeparacaoProdutos {
    LOGIN: string;
    LOGIN_COM_CODIGO: string;
    QTD: number;
    COD_ESTOQUISTA: number;
    TEMPO_MEDIO_MINUTOS: number;
    TOTAL_ORCAMENTOS: number;
    ULTIMA_SEPARACAO: string;
}