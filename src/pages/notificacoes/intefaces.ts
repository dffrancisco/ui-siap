export interface iNotificacao {
    id_notificacao: number;
    titulo: string;
    descricao: string;
    data_hora_criacao: string
}

export interface iQueryGetNotificacoes {
    offset: number;
    param: object;
}

export interface iGetNotificacoesResponse extends iNotificacao { }

export interface iParamInsertNotificacao {
    titulo: string;
    descricao: string;
}

export interface iResponseOk {
    ok: string;
}

export interface iInsertNotificacaoResponse {
    id_notificacao: number
}

export interface iParamUpdateNotificacao {
    id_notificacao: number;
    titulo: string;
    descricao: string;
}

export interface iUpdateNotificacaoResponse extends iResponseOk { }

export interface iInativarNotificacaoResponse extends iResponseOk { }

export interface iReativarNotificacaoResponse extends iResponseOk { }