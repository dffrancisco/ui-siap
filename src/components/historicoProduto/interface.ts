export interface iEntradasHistoricoProduto {
    NUM_NOTA_FISCAL: string,
    DATA_ENTRADA: string,
    NOME_FANTAZIA: string,
    QUANTIDADE: number,
    QTO_OLD: number,
    VENDA: number,
    CUSTO: number
}

export interface iSaidasHistoricoProduto {
    CLIENTE: string,
    VENDEDOR: string,
    DATA_VENDA: string,
    QUANTIDADE: number,
    VALOR_VENDA: number,
    NUM_ORCAMENTO: number,
    NOME_CLIENTE: string
}

export interface iComprasHistoricoProduto {
    ID_COMPRAS: number,
    DATA: string,
    COMPRADOR: string,
    QUANTIDADE: number

}

export interface iDevolucoesHistoricoProduto {
    NUM_ORCAMENTO: number,
    DT_ORCAMENTO: string,
    QUANTIDADE: number,
    DT_DEVOLUCAO: string
}

export interface iLogEstoquesNew {
    ID_LOG: number,
    DH_LOG: string,
    TELA: string,
    ESTOQUISTA: string,
    OPERACAO: string,
    CONTEUDO: string
}

export interface iMovAnual {
    COD_PRODUTO: number;
    MES: number;
    ANO: number;
    QUANTIDADE: number;
    ID_EMPRESA: number;
    ATUAL: string,
}

export interface iDescricaoProduto {
    DESC_PRODUTO: string;
}

export interface iDadosIniciaisHistoricosProdutos {
    PRODUTO: iDescricaoProduto;
    MOV_ANUAL: iMovAnual[];
}
export interface iOrcamento {
    NUM_ORCAMENTO: number,
    MES: number,
    ANO: number,
    DATA: string,
    HORA: string,
    ID_CLIENTE: number,
    ID_VENDEDOR: number,
    BOLETO: string,
    DESCONTO: number,
    VALOR: number,
    TIPO_PAGAMENTO: string,
    CLIENTE: string,
    CAIXA: string,
    VENDEDOR: string,
    NOME_CLIENTE: string,
    ESTOQUISTA: string
    TIPO_PAGAMENTO_FINAL: string
}
export interface iOrcamentoItens {
    NUM_FABRICANTE: string,
    DESC_PRODUTO: string,
    CARRO: string,
    END_ESTOQUE: string,
    QTO: number,
    VALOR: number,
    DESCONTO: number,
    SUBTOTAL: number
}

export interface paramDadosIniciais {
    codProduto: number,
    dataInicio: string,
    dataFim: string,
}
export interface paramEntradas {
    codProduto: number,
    pg: number
}

export interface paramSaidas {
    codProduto: number,
    pg: number
}
export interface paramCompras {
    codProduto: number,
    pg: number
}
export interface paramDevolucao {
    codProduto: number,
    pg: number
}

export interface paramEstoque {
    codProduto: number,
    pg: number
}


