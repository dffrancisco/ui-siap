export interface iFuncionario {
    COD_FUNCIONARIO: number;
    CPF: string;
    CARGO: string;
    LOGIN: string;
    NOME_COMP: string;
    QTD_PONTOS_INCOMPLETOS: number;
    QTD_PONTOS_NAO_BATIDOS: number;
    QTD_FALTAS_JUSTIFICADAS: number;
    QTD_A_JUSTIFICAR: number;
}

export interface iGetMesEAno {
    mes: number;
    ano: number;
}

export interface iTotalizador {

}