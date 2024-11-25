export interface iGetAvariasDestinosResponse extends iAvariaDestino { }

export interface iAvariaDestino {
    ID_TIPO_DESTINO: number,
    DESCRICAO: string
}

export interface iFiltro {
    NUM_FABRICANTE: string,
    REVISADA: number,
    DESTINO: number
}