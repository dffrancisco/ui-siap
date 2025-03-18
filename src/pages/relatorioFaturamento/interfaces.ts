export interface iClienteFaturado {
    ID_CLIENTE: number,
    NOME: string,
    CGC_CLIENTE: string
}

export interface iGetClientesFaturadosResponse extends iClienteFaturado { }

export interface iGetClientesFaturadosParam {
    search: string,
    dataInicio: string,
    dataFim: string,
}

export interface iOrcamentosClienteFaturado {
    NUM_ORCAMENTO: number,
    NUM_NFE: number,
    NOME: string,
    DATA: string,
    DEVOLUCAO: number,
    VALOR: number,
    MONTAGEM: number,
    DESCONTO: number,
}


export interface iGetOrcamentosClienteFaturadoResponse extends iOrcamentosClienteFaturado { }

export interface iGetOrcamentosClienteFaturadoParam {
    dataInicio: string,
    dataFim: string,
    id_cliente: number
}