export interface iGetTiposDestinosResponse extends iTipoDestino { }

export interface iTipoDestino {
    ID_TIPO_DESTINO: number,
    DESCRICAO: string
}

export interface iFiltro {
    NUM_FABRICANTE: string,
    REVISADA: number,
    DESTINO: number
}