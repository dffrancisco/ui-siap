export interface iTabs {
    dashboard: boolean;
    orcamentos: boolean;
    orcamentosNaoFinalizados: boolean;
    todosItens: boolean;
    comprasFaturadas: boolean;
    marca: boolean;
    creditoDevolucao: boolean;
    devolucao: boolean;
    vendaPorVendedor: boolean;
    vendasPorAno: boolean;
}

export interface iClientes {
    CGC_CLIENTE: string;
    CREDITO_USADO: number;
    ENDERECO: string;
    ID_CLIENTE: number;
    LIMITE_CREDITO: number;
    NOME: string;
    OBS: string;
    TELEFONE1: string;
}

export interface iGetClientes {
    search: string;
}

export interface iParamRequisicoes {
    idCliente: number;
    dataInicio: string;
    dataFim: string;
}