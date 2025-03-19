export interface iCarteiraBradesco {
    CODIGO_ESCRITURAL: string;
    DIGITO_CODIGO_ESCRITURAL: string;
    NUM_CARTEIRA: string;
}

export interface iDadosBoleto {
    AGENCIA: string;
    BANCO: string;
    CARTEIRA: string;
    CONTA_BANCARIA: string;
    JUROS: number;
    OBS_BOLETO: string;
}

export interface iDadosIniciaisConfigBoleto {
    carteiraBancoBradesco: iCarteiraBradesco[];
    dadosBoleto: iDadosBoleto;
}

export interface iParamUpdateConfigBoleto {
    banco: string;
    agencia: string;
    contaBancaria: string;
    carteira: string;
    juros: number;
    obsBoleto: string;
}