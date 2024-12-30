
export interface iDadosUsoConsumo {
    ID_USO_CONSUMO: number;
    DATA: string;
    DESCRICAO: string;
    CHAVE: string;
    VALOR: number;

}

export interface iResponseUsoConsumo {
    dadosRelatorio: iDadosUsoConsumo[];
    map: any;
}


export interface iParamsUsoConsumo {
    dataInicio: string;
    dataFim: string;
}
