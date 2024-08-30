export interface iClienteFaturado {
    ID_CLIENTE: number,
    NOME: string,
    CGC_CLIENTE: string
}

export interface iGetClientesFaturadosResponse extends iClienteFaturado { }

export interface iGetClientesFaturadosParam {
    search: string,
    dataLimite: string
}
