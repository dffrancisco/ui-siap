export interface iGetMetasTracadasParam {
    data: string;
}

export interface iGetFeriadosParam {
    data: string;
}

export interface iMetasTracada {
    geral: number,
    mercado: number,
    montagem: number,
    mecanica: number,
    ticket_medio: number,
    geral_noite: number,
    mercado_noite: number,
    montagem_noite: number,
    mecanica_noite: number
}

export interface iFeriados {
    qtdFeriadosCorridos: number,
    qtdFeriadosDoMes: number,
    qtdFeriadosParaFimMes: number
}

export interface iGetMetasTracadasResponse extends iMetasTracada { }
export interface iGetFeriadosResponse extends iFeriados { }

export interface iGetValoresParam {
    data: string,
    noturno: "S" | "N"
}


export interface iValores {
    vendas: number,
    mecanica: number,
    mercado: number,
    ticketMedio: number,
    montagem: number,
    vendasNoturna?: number,
    mercadoNoturno?: number,
    montagemNoturna?: number,
    mecanicaNoturna?: number,
    ticketMedioNoturno?: number,
    ticketMedioDiurno?: number,
    vendasDiurna?: number,
    mercadoDiurno?: number,
    montagemDiurna?: number,
    mecanicaDiurna?: number,
    vendasAcu: number,
    mercadoAcu: number,
    montagemAcu: number,
    mecanicaAcu: number,
    ticketMedioAcu: number,
    vendasNoturnaAcu?: number,
    mercadoNoturnoAcu?: number,
    montagemNoturnaAcu?: number,
    mecanicaNoturnaAcu?: number,
    ticketMedioNoturnoAcu?: number,
    ticketMedioDiurnoAcu?: number,
    vendasDiurnaAcu?: number,
    mercadoDiurnoAcu?: number,
    montagemDiurnaAcu?: number,
    mecanicaDiurnaAcu?: number
}

export interface iDadosMetaCard {
    nomeCard: string,
    valorGeral: number,
    valorDiaria: number,
    valorAcumulado: number
    porcentagem: number,
    backgroudColor: string,
    progressColor: string,
}

export interface iPrevisao {
    mediaVenda: number,
    desejado: number,
    previsaoValor: number,
    previsaoPorcentagem: string
}

export interface iGetValoresResponse extends iValores { }