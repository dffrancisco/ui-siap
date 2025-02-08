export interface iMarcas {
    ID_MARCA: number;
    DESCRICAO: string;
    GRUPO: string;
    ID_MARCA_GRUPO: number;
}

export interface iDadosRelatorioAvarias {
    DATA_HORA_INCLUSAO: string;
    PRODUTO: string;
    MARCA: string;
    QTD: number;
    DESCRICAO: string;
    ORIGEM_AVARIA: string;
    DESCRICAO_DESTINO: string;
    FUNCIONARIO_IDENTIFICOU: string;
    COD_FUNCIONARIO_IDENTIFICOU: number;
    NUM_FABRICANTE: string;
}