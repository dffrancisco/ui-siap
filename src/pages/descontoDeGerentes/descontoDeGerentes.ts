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
    confirmationInProgress: false,
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
        });

        await actions.carregaegarDados();
    },

    async abrirModalDarPermissao(usuario: iUsuario) {
        state.dbUsuarioSelecionado = usuario;
        state.modalPermitirUsuario = true;
    },

    async abrirModalAlterarSenha(usuario: iUsuario) {
        state.dbUsuarioSelecionado = usuario;
        state.modalAlterarSenha = true;
    },

    async carregaegarDados() {
        try {
            state.loading = true;
            const data = await actions.getUsuarios();

            if (data?.usuarios) {
                state.gridUsuariosSemPermissao.querySourceAdd(data.usuarios);
            }

            if (data?.usuariosComPermissao) {
                state.gridUsuariosComPermissao.querySourceAdd(data.usuariosComPermissao);
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            state.loading = false;
        }
    },


    async init() {
        await actions.grids();
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
                Swal.fire("Aviso", "As senhas não coincidem!", "warning");
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
};

export default { state, actions };
