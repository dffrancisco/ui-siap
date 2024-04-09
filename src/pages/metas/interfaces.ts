export interface iMesEAno {
    mes: number;
    ano: number;
}

export interface iResponseMetasVendedores {
    LOGIN: string;
    CARGO: string;
    CPF: string;
    ID_VENDEDOR: number;
    QTD_VENDAS: number;
    VALOR_TOTAL: number;
}


export interface iResponseMetasMontadores {
    LOGIN: string;
    CARGO: string;
    CPF: string;
    ID_MONTADOR: number;
    QTD_VENDAS: number;
    VALOR_TOTAL: number;
}

export interface iPropsMetas {
    vendedores: iResponseMetasVendedores[]
    montadores: iResponseMetasMontadores[]
}

export interface iPropsAtribuirMetaIndividual {
    vendedor: iResponseMetasVendedores
    montador: iResponseMetasMontadores
}