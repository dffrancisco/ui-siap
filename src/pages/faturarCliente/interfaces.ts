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

export interface iOrcamentosClienteFaturado {
    NUM_ORCAMENTO: number,
    NUM_NFE: number,
    NOME: string,
    DATA: string,
    DEVOLUCAO: number,
    VALOR: number,
    NUM_DEVOLUCAO: number,
}

export interface iOrcamentosLocalizados extends iOrcamentosClienteFaturado {
    ISDEVOLUCAO?: boolean
}

export interface iGetOrcamentosClienteFaturadoResponse extends iOrcamentosClienteFaturado { }

export interface iGetOrcamentosClienteFaturadoParam {
    dataLimite: string,
    id_cliente: number
}