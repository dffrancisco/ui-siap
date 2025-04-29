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
    DATA: string;
    VALOR: number;
    JUROS?: number;
    VALOR_JUROS?: number;
    checked?: boolean;
}

export interface iBoleto {
    NUM_BOLETO: number;
    VALOR: number;
    DATA_VENCIMENTO: string;
    JUROS?: number;
    VALOR_JUROS?: number;
    checked?: boolean;
}

export interface iDadosOrcamentosEBoletos {
    orcamentos: iOrcamento[];
    boletos: iBoleto[];
}

export interface iBaixarBoletosEOrcamentosParams {
    orcamentosSelecionadosBaixa: { numOrcamento: number; dataOrcamento: string; valorOrcamento: number, valorJuros: number }[];
    boletosSelecionadosBaixa: { numBoleto: number; valorBoleto: number, valorJuros: number }[];
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