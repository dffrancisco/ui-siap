export interface iFuncionario {
    COD_FUNCIONARIO: number;
    CPF: string;
    CARGO: string;
    LOGIN: string;
    NOME_COMP: string;
    AUSENCIAS: number;
}

export interface iGetMesEAno {
    mesSelect: number;
    anoSelect: number;
}