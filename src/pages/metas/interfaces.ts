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

export interface iPropsVendedores {
    mes: number;
    ano: number;
    vendedores: iResponseMetasVendedores[]
}