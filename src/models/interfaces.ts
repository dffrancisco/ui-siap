export interface iLogin {
    COD_FUNCIONARIO: number;
    NOME_COMP: string;
    LOGIN: string;
    CPF: string;
    ID_EMPRESA: number;
    token: string;
}

export interface iEmpresa {
    CGC_EMPRESA: string;
    RAZAO_SOCIAL: string;
    NOME_FANTAZIA: string;
    ENDERECO: string;
    UF: string;
    TELEFONE1: string;
    TELEFONE2: string;
    INSCRICAO: string;
    BAIRRO: string;
    CEP: string;
    DESCONTO_GERAL: number;
    IMPOSTO_FEDERAL: number;
    IMPOSTO_ESTADUAL: number;
    REGIME_TRIBUTARIO: number;
}
