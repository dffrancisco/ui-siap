export interface iParam {
    cod_funcionario: number;
    mes: number;
    ano: number;
}

export interface iPonto {
    TIPO: number;
    STATUS: string;
    COD_FUNCIONARIO: number;
    DATA: Date;
    HORA_CHEGADA: string;
    HORA_ALMOCO_INICIAL: string;
    HORA_ALMOCO_FINAL: string;
    HORA_SAIDA: string;
}