export interface iResponseDadosInput {
    funcionarios: iFuncionarios[];

}

export interface iFuncionarios {
    CARGO: string;
    LOGIN: string;
    CPF: string;
    ID_CARGO: number;
    COD_FUNCIONARIO: number;
}
