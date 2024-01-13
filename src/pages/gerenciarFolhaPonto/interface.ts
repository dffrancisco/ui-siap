export interface iFuncionario {
    COD_FUNCIONARIO: number;
    CPF: string;
    CARGO: string;
    LOGIN: string;
    NOME_COMP: string;
    QTD_PONTOS_INCOMPLETOS: number;
}

export interface iGetMesEAno {
    mesSelect: number;
    anoSelect: number;
}