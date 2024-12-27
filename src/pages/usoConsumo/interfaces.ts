
export interface iDadosUsoConsumo {
    ID_USO_CONSUMO: number;
    DATA: Date;
    DESCRICAO: string;
    CHAVE: string;
    VALOR: number;
}

export interface iResponseUsoConsumo {
    dadosRelatorio: iDadosUsoConsumo[];
}


export interface iParamsUsoConsumo {
    dataInicio: string;
    dataFim: string;
}
