export interface iNota {
    ID_ENTRADA: string;
    CNPJ: string;
    loja: string;
    NUM_NOTA: string;
    DATA: string;
    HORA: string;
    QTO_ITENS: number;
}

export interface iItemNota {
    COD_PRODUTO: string;
    DESC_PRODUTO: string;
    NUM_FABRICANTE: string;
    CUSTO: number;
    VENDA: number;
    CUSTO_N: number;
    VENDA_N: number;
    ATUALIZAR: 'S' | 'N';
}

export interface iParamGetItensNotas {
    ID_ENTRADA: string;
    CNPJ: string;
}

export interface iParamUpdateProdutos {
    loja: string;
    idEntrada: string;
    numNota: string;
    dataNota: string;
    itensNota: iItemNota[];
    cnpj: string;
}
export interface iRespostaAtualizacao {
    itensAtualizados?: iItemNota[];
}