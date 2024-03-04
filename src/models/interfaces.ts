export interface iLogin {
    COD_FUNCIONARIO: number;
    NOME_COMP: string;
    LOGIN: string;
    CPF: string;
    ID_EMPRESA: number;
    token: string;
}

export interface iEmpresa {
    // ID_EMPRESA: string;
    CGC_EMPRESA: string;
    RAZAO_SOCIAL: string;
    NOME_FANTAZIA: string;
    ENDERECO: string;
    // COD_CIDADE: number;
    TELEFONE1: string;
    TELEFONE2: string;
    INSCRICAO: string;
    // OBS_NOTA_FISCAL: string;
    // OBS_BOLETO: string;
    // END_FOTO: string;
    BAIRRO: string;
    CEP: string;
    DESCONTO_GERAL: number;
    // VERCAO_ABERTURA: string;
    IMPOSTO_FEDERAL: number;
    IMPOSTO_ESTADUAL: number;
    REGIME_TRIBUTARIO: number;
    // ID_CSC_HOMOLOGACAO: string;
    // CSC_HOMOLOGACAO: string;
    // ID_CSC_PRODUCAO: string;
    // CSC_PRODUCAO: string;
    UF: string;
}