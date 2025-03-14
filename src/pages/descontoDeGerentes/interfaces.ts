export interface iUsuario {
    COD_FUNCIONARIO: number;
    NOME_COMP: string;
}

export interface iUsuarioComPermissao {
    COD_FUNCIONARIO: number;
    NOME_COMP: string;
}

export interface iHistoricoSenha {
    HISTORICO?: string;
}

export interface iGetUsuariosResponse {
    usuarios?: iUsuario[];
    usuariosComPermissao?: iUsuario[];
}

export interface iUsuarioDesconto {
    COD_FUNCIONARIO?: number;
    SENHA?: string;
    HISTORICO?: string;
    NOME_COMP?: string;
    SENHA_ATUAL?: string;

}

export interface iParamGetUsuarios { }
export interface iParamGetUsuariosComPermissao { }

export interface iParamDarPermissao extends iUsuarioDesconto { }
export interface iDarPermissaoResponse { }

export interface iParamAlterarSenha extends iUsuarioDesconto { }
export interface iAlterarSenhaResponse { }

export interface iParamRemoverPermissao extends iUsuarioDesconto { }
export interface iRemoverPermissaoResponse { }

export interface iGetUsuariosResponse extends iUsuario { }
export interface iGetUsuariosComPermissaoResponse extends iUsuarioComPermissao { }
export interface iGetHistoricoSenhaResponse extends iHistoricoSenha { }
