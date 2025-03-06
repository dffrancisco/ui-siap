import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import Swal from "sweetalert2";
import serviceDescontoDeGerentes from "./services/descontoDeGerentes.service";
import { iUsuario } from "./interfaces";

export const state = reactive({
    gridUsuariosSemPermissao: <ixGridCreate>{},
    gridUsuariosComPermissao: <ixGridCreate>{},
    funcionario: <iUsuario>{},
    modalUsuarios: <iModalCreate>{},
    modalUsuariosComPermissao: <iModalCreate>{},

    dbUsuarioSelecionado: <iUsuario>{},
    loading: false,
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
        });

        await actions.loadData();
    },

    async loadData() {
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
};

export default { state, actions };
