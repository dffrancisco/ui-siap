import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import serviceDescontoDeGerentes from "./services/descontoDeGerentes.service";
import { iUsuario, iParamDarPermissao, iParamAlterarSenha, iParamRemoverPermissao } from "./interfaces";

export const state = reactive({
    gridUsuariosSemPermissao: <ixGridCreate>{},
    gridUsuariosComPermissao: <ixGridCreate>{},
    funcionario: <iUsuario>{},
    dbUsuarioSelecionado: <iUsuario>{},
    senhaTemp: "",
    modalAlterarSenha: false,
    modalPermitirUsuario: false,
    senhaConfirmacao: "",
    loading: false,
});

export const actions = {
    async grids() {
        state.gridUsuariosSemPermissao = new xGridV2.create({
            el: "#pnUsuariosSemPermissao",
            height: 400,
            columns: {
                "Nome do Usuario": { dataField: "NOME_COMP", width: "100%" },
            },
            click: (rowData: iUsuario) => {
                state.dbUsuarioSelecionado = rowData;
            },
            dblClick: () => actions.focarNaGridComPermissao(),
            enter: () => actions.focarNaGridComPermissao(),
        });

        state.gridUsuariosComPermissao = new xGridV2.create({
            el: "#pnUsuariosComPermissao",
            height: 400,
            columns: {
                "Nome do Usuario": { dataField: "NOME_COMP", width: "100%" },
            },
            click: (rowData: iUsuario) => {
                state.dbUsuarioSelecionado = rowData;
            },
            dblClick: () => actions.focarNaGridSemPermissao(),
            enter: () => actions.focarNaGridSemPermissao(),
        });

        await actions.carregarDadoDeUsuario();
    },


    async init() {
        await actions.grids();
    },

    async abrirModalDarPermissao(usuario: iUsuario) {
        state.dbUsuarioSelecionado = usuario;
        state.modalPermitirUsuario = true;
    },

    async abrirModalAlterarSenha(usuario: iUsuario) {
        state.dbUsuarioSelecionado = usuario;
        state.modalAlterarSenha = true;
    },

    async carregarDadoDeUsuario() {
        try {
            state.loading = true;
            const data = await actions.getUsuarios();

            if (data.usuarios && data.usuariosComPermissao) {

                const usuariosSemPermissaoFiltrados = data.usuarios.filter(usuario =>
                    !data.usuariosComPermissao.some(usuarioRepetido => usuarioRepetido.COD_FUNCIONARIO === usuario.COD_FUNCIONARIO)
                );
                state.gridUsuariosSemPermissao.querySourceAdd(usuariosSemPermissaoFiltrados);
                state.gridUsuariosComPermissao.querySourceAdd(data.usuariosComPermissao);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar os dados dos usuários!",
            });
            return;
        } finally {
            state.loading = false;
        }
    },

    async getUsuarios() {
        try {
            const data = await serviceDescontoDeGerentes.getInicial();
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar os usuários sem permissão!",
            });
        }
    },

    async darPermissao() {
        try {
            if (state.senhaTemp.length < 6) {
                Swal.fire({
                    icon: "warning",
                    text: "Senha deve ter no mínimo 6 caracteres!",
                });
                return;
            }

            if (state.senhaTemp !== state.senhaConfirmacao) {
                Swal.fire({
                    icon: "warning",
                    text: "As senhas não coincidem!",
                });
                return;
            }

            state.loading = true;
            const params: iParamDarPermissao = {
                COD_FUNCIONARIO: state.dbUsuarioSelecionado.COD_FUNCIONARIO,
                SENHA: utils.base64_encode(state.senhaTemp)
            };

            await serviceDescontoDeGerentes.darPermissao(params);
            state.gridUsuariosComPermissao.insertLine(state.dbUsuarioSelecionado);
            state.gridUsuariosSemPermissao.deleteLine();

        } catch (error) {
            Swal.fire({
                icon: "warning",
                text: "Senha atual errada, informe a senha atual correta!",
            });
        } finally {
            state.loading = false;
        }
    },

    async alterarSenha() {
        try {
            if (state.senhaTemp !== state.senhaConfirmacao) {
                Swal.fire({
                    icon: "warning",
                    text: "As senhas não coincidem!",
                });
                return;
            }
            state.loading = true;
            const params: iParamAlterarSenha = {
                COD_FUNCIONARIO: state.dbUsuarioSelecionado.COD_FUNCIONARIO,
                SENHA_ATUAL: utils.base64_encode(state.senhaTemp),
                SENHA: utils.base64_encode(state.senhaConfirmacao)
            };
            await serviceDescontoDeGerentes.alterarSenha(params);
            Swal.fire("Senha alterada com sucesso!", "success");

        } catch (error) {
            Swal.fire({
                icon: "warning",
                text: "Informe a senha atual correta!",
            });
        } finally {
            state.loading = false;
        }
    },

    async removerPermissao() {
        const usuario = state.dbUsuarioSelecionado || state.gridUsuariosComPermissao.dataSource();
        if (!usuario) return;
        {
            try {
                state.loading = true;
                const params: iParamRemoverPermissao = { COD_FUNCIONARIO: usuario.COD_FUNCIONARIO };
                await serviceDescontoDeGerentes.removerPermissao(params);
                state.gridUsuariosSemPermissao.insertLine(usuario);
                state.gridUsuariosComPermissao.deleteLine();
            } catch (error) {
                Swal.fire({
                    icon: "warning",
                    text: "Informe a senha atual correta!",
                });
            } finally {
                state.loading = false;
            }
        }
    },

    async confirmRemoverPermissao(usuario: iUsuario) {
        if (await Swal.fire({
            text: "Deseja remover a permissão deste usuário?",
            icon: "warning", showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        }).then(result => result.isConfirmed)) {
            state.dbUsuarioSelecionado = usuario;
            await actions.removerPermissao();
        }
    },

    onDarPermissao() {
        if (!state.dbUsuarioSelecionado || !state.dbUsuarioSelecionado.COD_FUNCIONARIO) {
            Swal.fire({
                icon: "warning",
                text: "Selecione um usuário sem permissão!",
            });
            return;
        }

        actions.abrirModalDarPermissao(state.dbUsuarioSelecionado);
    },

    onRemoverPermissao() {
        if (!state.dbUsuarioSelecionado || !state.dbUsuarioSelecionado.COD_FUNCIONARIO) {
            Swal.fire({
                icon: "warning",
                text: "Selecione um usuário com permissão!",
            });
            return;
        }
        actions.confirmRemoverPermissao(state.dbUsuarioSelecionado);
    },

    onPermissaoConcedida() {
        state.gridUsuariosComPermissao.insertLine(state.dbUsuarioSelecionado);
        state.gridUsuariosSemPermissao.deleteLine();
        state.modalPermitirUsuario = false;
    },

    onAlterarSenha() {
        if (!state.dbUsuarioSelecionado || !state.dbUsuarioSelecionado.COD_FUNCIONARIO) {
            Swal.fire({
                icon: "warning",
                text: "Selecione um usuário com permissão!",
            });
            return;
        }
        actions.abrirModalAlterarSenha(state.dbUsuarioSelecionado);
    },

    focarNaGridComPermissao() {
        state.gridUsuariosComPermissao.focus();
    },

    focarNaGridSemPermissao() {
        state.gridUsuariosSemPermissao.focus();
    },
};

export default { state, actions };
