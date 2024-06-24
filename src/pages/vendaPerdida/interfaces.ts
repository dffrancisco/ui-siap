export interface iParamGetVendasPerdidas {
    DATA_INICIO: string,
    DATA_FIM: string,
}

export interface iGetVendasPerdidasResponse {
    COD_PRODUTO: number;
    NUM_FABRICANTE: string;
    NUM_FABRICANTE2: string;
    QUANTIDADE: number;
    DESC_PRODUTO: string;
    DESC_PRODUTO_COMPLETA: string;
    ID_MARCA: number;
    DESC_MARCA: string;
    QUANTIDADE_PERDIDA: number;
    DATA: string[];
    HORA: string[];
    COD_FUNCIONARIO: number[];
    NOME_COMP: string[];
    LOGIN: string[];
}