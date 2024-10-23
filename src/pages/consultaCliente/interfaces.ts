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
    cnpj?: string;
}

export interface iBoletoDashboard {
    TOTALBOLETOS: number;
    BOLETOSATRASADOS: number;
    BOLETOSEMDIA: number;
    BOLETOSABERTOS: number;
    ID_CLIENTE: number;
}

export interface iDevolucoesDashboard {
    ORCAMENTOS: number;
    DEVOLUCOES: number;
    LOGIN: string;
}

export interface iMarcaDashboard {
    DESCRICAO: string;
    QUANTIDADE: number;
    ID_MARCA: number;
    ID_CLIENTE: number;
}

export interface iTicketMedioDashboard {
    TICKET_MEDIO: number;
    TOTAL: number;
    ORCAMENTOS: number;
}

export interface iOrcamento {
    NUM_ORCAMENTO: number;
    NOME_CLIENTE: string;
    ID_VENDEDOR: number;
    DATA: string;
    VALOR_MONTAGEN: number;
    DESCONTO: number;
    VALOR: number;
    LOGIN: string;
    HORA: string;
}

export interface iOrcamentosEmAndamento {
    COD_FUNCIONARIO: number;
    DATA: string;
    DESCONTO: number;
    LOGIN: string;
    NOME_CLIENTE: string;
    NUM_ORCAMENTO: number;
    VALOR: number;
    VALOR_MONTAGEN: number;
}

export interface iComprasFaturadas {
    NUM_ORCAMENTO: number;
    DATA: string;
    HORA: string;
    CAIXA: string;
    VENDEDOR: string;
    BOLETO: string;
    DESCONTO: number;
    TIPO_PAGAMENTO: string;
    VALOR: number;
    DEVOLUCAO: number;
    VALOR_MONTAGEN: number;
    NOME_CLIENTE: string;
    ID_CLIENTE: number;
}

export interface iTodosItens {
    COD_PRODUTO: number;
    QUANTIDADE: number;
    NUM_FABRICANTE: string;
    DESC_PRODUTO: string;
    ID_CLIENTE: number;
}

export interface iMarca {
    DESCRICAO: string;
    QUANTIDADE: number;
    ID_MARCA: number;
    ID_CLIENTE: number;
}
export interface iCreditoDevolucao {
    NUM_ORCAMENTO: number;
    VALOR: number;
    DATA_CREDITO: string;
    DATA_DO_USO: string;
    DATA_ORCAMENTO: string;
}

export interface iDevolucao {
    DATA: string;
    DATA_VENDA: string;
    DESC_PRODUTO: string;
    ID_DEVOLUCAO: number;
    NUM_ORCAMENTO: number;
}

export interface iVendaPorVendedor {
    VENDAS: number;
    VENDEDOR: string;
}

export interface iVendasPorAno {
    MES: number;
    VALOR: number;
}

export interface iResponseDadosCliente {
    boletosDashboard: iBoletoDashboard[];
    comprasFaturadas: iComprasFaturadas[];
    creditoDevolucao: iCreditoDevolucao[];
    devolucao: iDevolucao[];
    devolucoesDashboard: iDevolucoesDashboard[];
    marca: iMarca[];
    marcaDashboard: iMarcaDashboard[];
    orcamentos: iOrcamento[];
    orcamentosEmAndamento: iOrcamentosEmAndamento[];
    ticketMedioDashboard: iTicketMedioDashboard[];
    todosItens: iTodosItens[];
    vendaPorVendedor: iVendaPorVendedor[];
    vendasPorAno: iVendasPorAno[];
}

export interface iBoletosAbertos {
    DATA_PROCESSAMENTO: string | null;
    DATA_QUITACAO: string | null;
    DATA_REEMPRESSAO: string | null;
    DATA_VENCIMENTO: string;
    DIASATRAZO: number | string | null;
    DIVISAO: string;
    HISTORICO: string;
    ID_CLIENTE: number;
    ID_EMPRESA: number;
    LOG: string;
    NUM_BOLETO: number;
    VALOR: number;
    VALOR_QUITACAO: number | null;
    VALOR_REEMPRESSAO: number | null;
}

export interface iBoletosAtrasados extends iBoletosAbertos { }

export interface iBoletosEmDia {
    DATA_PROCESSAMENTO: string | null;
    DATA_QUITACAO: string | null;
    DATA_VENCIMENTO: string;
    DIVISAO: string;
    NUM_BOLETO: number;
    VALOR: number;
}

export interface iTodosBoletos extends iBoletosEmDia { }

export interface iParamDetalhesOrc {
    numOrcamento: number;
    data: string;
}

export interface iDetalhesItensOrc {
    CARRO: string;
    DESC_PRODUTO: string;
    NUM_FABRICANTE: string;
    NUM_ORCAMENTO: number;
    QTO: number;
    SUBTOTAL: number;
    UNIDADE: string;
    VALOR: number;
}

export interface iDetalhesMontagemOrc {
    DESC_MONTAGEN: string;
    CARRO: string;
    MODELO: string;
    PLACA: string;
    VALOR: number;
    DATA: string;
    MONTADOR: string;
}

export interface iDetalhesOrcamento {
    itensOrcamento?: iDetalhesItensOrc[];
    montagemOrcamento?: iDetalhesMontagemOrc[]
}

export interface iParamDetalhesItensOrc {
    codProduto: number;
    idCliente: number;
    dataInicio: string;
    dataFim: string;
}

export interface iDetalhesItensOrcamento {
    DATA: string;
    DESC_PRODUTO: string;
    HORA: string;
    NUM_ORCAMENTO: number;
    QUANTIDADE: number;
}

export interface iParamComprasFaturadas {
    numOrcamento: number;
    data: string;
}

export interface iBoletosComprasFaturadas {
    NUM_BOLETO: number;
    DATA_VENCIMENTO: string;
    VALOR: number;
    DATA_PROCESSAMENTO: string;
    DATA_QUITACAO: string;
    DIVISAO: string;
}