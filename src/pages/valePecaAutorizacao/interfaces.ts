export interface iFuncionario {
    "COD_FUNCIONARIO": number,
    "CPF": string,
    "NOME_COMP": string,
    "DATA_ADMISSAO": string,
    "CARGO": string,
    "NOME_COM_COD"?: string
}

export interface iValeFuncionario {
    "NUM_ORCAMENTO": number,
    "DATA": string,
    "VALOR": number,
    "DIV": string,
    "QUITADO": "NAO" | 'SIM'
}