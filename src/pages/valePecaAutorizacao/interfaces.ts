export interface iFuncionario {
    COD_FUNCIONARIO: number,
    CPF: string,
    NOME_COMP: string,
    DATA_ADMISSAO: string,
    CARGO: string,
    NOME_COM_COD?: string
}

export interface iValeFuncionario {
    NUM_ORCAMENTO: number,
    DATA: string,
    VALOR: number,
    DIV: string,
    QUITADO: "NAO" | 'SIM'
}

export interface iOrcamento {
    NUM_ORCAMENTO: number,
    DATA: string,
    EFETIVADO: "1" | "2",
    DESCONTO: number,
    VALOR: number,
    CNPJ: string,
    ITENS: iOrcamentoItem[],
    error?: boolean,
    msg?: string
}

export interface iOrcamentoItem {
    COD_PRODUTO: number,
    DESC_PRODUTO: string,
    VALOR: number,
    QTO: number,
    VALOR_TOTAL: number,
    NUM_FABRICANTE: string
}