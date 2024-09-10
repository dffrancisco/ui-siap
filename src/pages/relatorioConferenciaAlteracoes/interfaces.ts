export interface iFuncionarios {
    CARGO: string;
    LOGIN: string;
    CPF: string;
    ID_CARGO: number;
    COD_FUNCIONARIO: number;
}

export interface iTelas {
    TELA: string;
}

export interface iParams {
    page: number;
    itemsPerPage: number;
    mes: number;
    ano: number | string;
}

export interface iResponseDadosInput {
    funcionarios: iFuncionarios[];
    telas: iTelas[];
}