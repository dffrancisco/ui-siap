import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import serviceDescontoDeGerentes from "./services/descontoDeGerentes.service";
import { iUsuario, iParamDarPermissao, iParamAlterarSenha, iParamRemoverPermissao } from "./interfaces";

export const state = reactive({
    gridUsuariosSemPermissao: <ixGridCreate>{},
    gridUsuariosComPermissao: <ixGridCreate>{},
    funcionario: <iUsuario>{},
    modalUsuarios: <iModalCreate>{},
    modalUsuariosComPermissao: <iModalCreate>{},
    dbUsuarioSelecionado: <iUsuario>{},
    senhaTemp: "",
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
                "Nome": { dataField: "NOME_COMP", width: "100%" },
            },
        });

        state.gridUsuariosComPermissao = new xGridV2.create({
            el: "#pnUsuariosComPermissao",
            height: 400,
            columns: {
                "Nome": { dataField: "NOME_COMP", width: "100%" },
            },

            click: (rowData: iUsuario) => {
                actions.confirmRemoverPermissao(rowData);
            },
        });

        await actions.carregaegarDados();
    },

    async carregaegarDados() {
        try {
            state.loading = true;
            const [usuarios, usuariosComPermissao] = await Promise.all([
                actions.getUsuariosSempermissao(),
                actions.getUsuariosComPermissao(),
            ]);

            if (usuarios) {
                state.gridUsuariosSemPermissao.querySourceAdd(usuarios);
            }

            if (usuariosComPermissao) {
                state.gridUsuariosComPermissao.querySourceAdd(usuariosComPermissao);
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

    async getUsuariosSempermissao() {
        try {
            const data = await serviceDescontoDeGerentes.getUsuarios();
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar os usuários sem permissão!",
            });
        }
    },

    async getUsuariosComPermissao() {
        try {
            const data = await serviceDescontoDeGerentes.getUsuariosComPermissao();
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar os usuários com permissão!",
            });
        }
    },

    async abrirModalDarPermissao(usuario: iUsuario) {
        state.dbUsuarioSelecionado = usuario;
        state.modalUsuarios.open();
    },

    async abrirModalAlterarSenha(usuario: iUsuario) {
        state.dbUsuarioSelecionado = usuario;
        state.modalUsuariosComPermissao.open();
    },

    async darPermissao() {
        try {
            if (state.senhaTemp.length < 6) {
                Swal.fire("Aviso", "Senha deve ter no mínimo 6 caracteres!", "warning");
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
            state.modalUsuarios.close();
        } catch (error: any) {
            Swal.fire("Erro", error.response?.data?.message || "Falha ao conceder permissão", "error");
        } finally {
            state.loading = false;
        }
    },

    async alterarSenha() {
        try {
            if (state.senhaTemp !== state.senhaConfirmacao) {
                Swal.fire("Aviso", "As senhas não coincidem!", "warning");
                return;
            }
            state.loading = true;
            const params: iParamAlterarSenha = {
                COD_FUNCIONARIO: state.dbUsuarioSelecionado.COD_FUNCIONARIO,
                SENHA_ATUAL: Buffer.from(state.senhaTemp).toString('base64'),
                SENHA: Buffer.from(state.senhaConfirmacao).toString('base64')
            };
            await serviceDescontoDeGerentes.alterarSenha(params);
            Swal.fire("Sucesso", "Senha alterada com sucesso!", "success");
            state.modalUsuariosComPermissao.close();
        } catch (error: any) {
            Swal.fire("Erro", error.response?.data?.message || "Falha ao alterar senha", "error");
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
            } catch (error: any) {
                Swal.fire("Erro", error.response?.data?.message || "Falha ao remover permissão", "error");
            } finally {
                state.loading = false;
            }
        }
    },

    async confirmRemoverPermissao(usuario: iUsuario) {

        if (await Swal.fire({ text: "Deseja remover a permissão deste usuário?", icon: "warning", showCancelButton: true, confirmButtonText: "Sim", cancelButtonText: "Não" }).then(result => result.isConfirmed)) {
            state.dbUsuarioSelecionado = usuario;
            await actions.removerPermissao();
        }
    },
};

export default { state, actions };
