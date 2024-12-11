export interface iMdc {
    DATA: string;
    OPEN_CLOSE: string;
    STATOS: string;
}

export interface iFuncionarios {
    COD_FUNCIONARIO: number;
    LOGIN: string;
}

export interface iCaixasAbertos {
    CPF: string;
    HORA_ABERTURA: string;
    HORA_FECHAMENTO: string;
    ID_ABERTURA_CAIXA: string;
    LOGIN: string;
    STATUS: number
}

export interface iDadosAbrirCaixa {
    mdc: iMdc | null;
    funcionarios: iFuncionarios[];
    caixasAbertos: iCaixasAbertos[];
}

// <input
// id="inputMeta"
// :clearable="false"
// v-model.lazy="state.inputValor"
// :model-modifiers="{ number: true }"
// v-money3="{ ...configVMoney, max: 1000000 }"
// autofocus
// @keydown.enter="abrirCaixa()"
// />