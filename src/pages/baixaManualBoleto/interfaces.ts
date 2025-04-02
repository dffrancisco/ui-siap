export interface iClientesFaturados {
    CLIENTE: string;
    CNPJ: string;
    ID_CLIENTE: number;
}

export interface iGetClientesFaturados {
    search: string;
}

export interface iParamGetOrcamentos {
    ID_CLIENTE: number;
    CNPJ: string;
}

export interface iOrcamento {
    NUM_ORCAMENTO: number;
    NUM_NFE: number;
    NOME: string;
    DATA: string;
    DEVOLUCAO: number;
    VALOR: number;
    NUM_DEVOLUCAO: number;
    MONTAGEM: number;
    JUROS?: number;
    VALOR_JUROS?: number;
    checked?: boolean;
}

export interface iBoleto {
    NUM_BOLETO: number;
    VALOR: number;
    DATA_PROCESSAMENTO: string;
    DATA_VENCIMENTO: string;
    DIVISAO: string;
    JUROS?: number;
    VALOR_JUROS?: number;
    checked?: boolean;
}

export interface iDadosOrcamentosEBoletos {
    orcamentos: iOrcamento[];
    boletos: iBoleto[];
}

export interface iBaixarBoletosEOrcamentosParams {
    orcamentosSelecionadosBaixa: { numOrcamento: number; dataOrcamento: string; valorOrcamento: number }[];
    boletosSelecionadosBaixa: { numBoleto: number; valorBoleto: number }[];
    dadosParaLog: {
        dataExtrato: string;
        idsExtrato: string[];
        numOrcamentos: number[];
        numBoletos: number[];
        totalBaixa: number;
    };
}

export interface iParamAddJuros {
    numBoleto: number,
    numOrcamento: number,
    dataOrcamento: string,
    valorJuros: number,
}