export interface iCliente {
    ID_CLIENTE: number;
    NOME: string;
    CGC_CLIENTE: string;
    QTD: number;
}

export interface iMarca {
    ID_MARCA: number;
    DESCRICAO: string;
}

export interface iMarcaAdicionada {
    ID_MARCA: number;
    DESCRICAO: string;
    DESCONTO: number;
    DATA_INICIAL: Date;
    DATA_FINAL: Date;
}