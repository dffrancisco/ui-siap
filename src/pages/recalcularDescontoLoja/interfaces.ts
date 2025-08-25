export interface iOrcamento {
    NUM_ORCAMENTO: number
    DATA: string
    VALOR: number
    CPF: number
    NOME_COMP: string
    ID_VENDEDOR: number,
    COD_FUNCIONARIO: number
}
export interface iVendedor {
    COD_FUNCIONARIO: number,
    NOME_COMP: string,
    CPF: string,
}
export interface iParamUpdateVendedor {
    NUM_ORCAMENTO: number,
    ID_VENDEDOR: number,
    COD_FUNCIONARIO_AUTH: number

}