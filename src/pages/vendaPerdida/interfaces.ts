export interface iParamGetVendasPerdidas {
    DATA_INICIO: string,
    DATA_FIM: string,
}

export interface iParamDetalhes {
    DATA_INICIO: string,
    DATA_FIM: string,
    COD_PRODUTO: number
}

export interface iGetVendasPerdidasResponse {
    COD_PRODUTO: number;
    NUM_FABRICANTE: string;
    NUM_FABRICANTE2: string;
    QUANTIDADE: number;
    DESC_PRODUTO: string;
    DESC_MARCA: string;
    QUANTIDADE_PERDIDA: number;
}

export interface iGetDetalhesResponse {
    ID_LOG_VENDA_PERDIDA: number
    COD_PRODUTO: number
    COD_FUNCIONARIO: number
    DATA: string
    HORA: string
    LOGIN: string
}