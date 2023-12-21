export interface iGetEntregarReceberPendenteParam {
    offset: number,
    codFuncionario: number | undefined,
    idCliente: number | undefined,
    numOrcamento: number | undefined,
}

export interface iEntregarReceber {
    NUM_ORCAMENTO: number,
    DATA: string,
    HORA: string,
    TIPO_PAGAMENTO: string,
    COD_FUNCIONARIO_MOTORISTA: number,
    NOME_MOTORISTA: string | null,
    CPF: string,
    VALOR: number,
    ID_CLIENTE: number,
    CLIENTE: string,
    NOME_CLIENTE: string,
    ID_EMPRESA: number,
    VENDEDOR: string,
    DESCRICAO_PAGAMENTO: string,
    OBSERVACAO: string,
}

export interface iMotorista {
    COD_FUNCIONARIO: number,
    CPF: string,
    NOME_MOTORISTA: string,
}

export interface iCartaoDisponivel {
    COD_BANDEIRA_CARTAO: number,
    DESCRICAO: string,
    DIVISAO: number,
}

export interface iOrcamentoBaixa {
    NUM_ORCAMENTO: number,
    DATA: string,
    TIPO_PAGAMENTO: string,
    DESCRICAO_PAGAMENTO: string | undefined,
    VALOR: number,
    CLIENTE: string | undefined,
    NOME_MOTORISTA: string | undefined,
}

export interface iTrocarMotoristaFunctionParam {
    codFuncionario: number,
    numOrcamento: number,
    data: string,
}

export interface iInsertUpdateObsEntregarReceberFunctionParam {
    numOrcamento: number,
    data: string,
    obs: string,
}

export interface iUpdateDescPendenciaMotoristaFunctionParam {
    numOrcamento: number,
    data: string,
    descPendencia: string,
}

export interface iGetOrcamentosBaixaFunctionParam {
    numOrcamento: number,
    data: string | undefined,
}

interface iCartoes {
    tipo: "D" | "C";
    valor: number;
    numCartaoAut: string;
    codBandeira: string;
    divide: number;
}
export interface iDeposito {
    valor: number;
    controle: string;
    autorizado: string;
}

export interface iPix {
    valor: number;
    controle: string;
    autorizado: string;
}

export interface iTipos {
    "1": { valor: number }
    "2": { valor: number; cartoes: iCartoes[] };
    "8": { valor: number; depositos: iDeposito[] };
    "P": { valor: number; pix: iPix[] };
}

export interface iTipos {
    "1": { valor: number }
    "2": { valor: number; cartoes: iCartoes[] };
    "8": { valor: number; depositos: iDeposito[] };
    "P": { valor: number; pix: iPix[] };
}

export type iTipoPagamento = '1' | '2' | '8' | 'P';

export interface iPagamento {
    tipoPagamento: iTipoPagamento,
    descricaoTipoPagamento: string,
    valor: number,
    codigoBandeiraCartao?: number,
    autorizacao?: string,
    tipoCartao?: 'D' | 'C',
    divisaoCartao?: number
}

export interface iPagamentoTotal {
    tipoPagamento: string
    valorRecebido: number
    tipos: iTipos
}

export interface iBaixarEntregarReceberFunctionParam {
    numOrcamento: number
    data: string
    tipoPagamento: iTipoPagamento
    pagamento: iPagamentoTotal
}

export interface iBaixarPendenciaFunctionParam {
    numOrcamento: number
    data: string
}