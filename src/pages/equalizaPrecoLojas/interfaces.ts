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
    COD_TRAY?: string;
    VENDA_WEB?: number;
}

export interface iParamGetItensNotas {
    ID_ENTRADA: string;
    CNPJ: string;
}
