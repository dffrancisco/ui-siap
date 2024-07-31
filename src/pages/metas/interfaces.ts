export interface iGetMetasTracadaParam {
    data: string;
    cnpj: string;
}

export interface iGetMetasTracadaResponse {
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

export interface iGetValoresParam {
    data: string,
    noturno: 'S' | 'N'
}

export interface iVendas {
    VALOR: number;
    QTD: number;
}

export interface iGetValoresResponse {
    vendas: iVendas,
    mecanica: number,
    mercado: number,
    ticketMedio: number,
    montagem: number,
    vendasNoturna?: iVendas,
    mercadoNoturno?: number,
    montagemNoturna?: number,
    mecanicaNoturna?: number,
    ticketMedioNoturno?: number,
    ticketMedioDiurno?: number,
    vendasDiurna?: number,
    mercadoDiurno?: number,
    montagemDiurna?: number,
    mecanicaDiurna?: number,
    vendasAcu: iVendas,
    mercadoAcu: number,
    montagemAcu: number,
    mecanicaAcu: number,
    ticketMedioAcu: number,
    vendasNoturnaAcu?: iVendas,
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