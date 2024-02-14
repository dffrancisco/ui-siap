export interface iCliente {
    ID_CLIENTE: number;
    NOME: string;
    CGC_CLIENTE: string;
    QTD: number;
}

export interface iMarca {
    ID_MARCA: number;
    DESCRICAO: string;
    ID_CLIENTE: number;
}

export interface iMarcaAdicionada {
    ID_MARCA: number;
    ID_CLIENTE: number;
    DESCRICAO: string;
    DESCONTO: number;
    DATA_INICIAL: Date;
    DATA_FINAL: Date;
}

export interface iMarcaAdicionadaForm {
    DESCONTO: string;
    DESCRICAO: string;
    DATA_INICIAL: Date;
    DATA_FINAL: Date;
}

export interface iParamGetClientes {
    offset: number;
    param: object;
}

export interface iParamGetMarcas {
    offset: number;
    param: object;
}

export interface iParamGetMarcasAdicionadas {
    offset: number;
    param: object;
}

export interface iGetClienteResponse extends iCliente { }
export interface iGetMarcaResponse extends iMarca { }
export interface iGetMarcaAdicionadaResponse extends iMarcaAdicionada { }
export interface iParamAdicionarMarca extends iMarcaAdicionada { }
export interface iAdicionarMarcaResponse extends iMarcaAdicionada { }
