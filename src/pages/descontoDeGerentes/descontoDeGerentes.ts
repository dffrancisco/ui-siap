import { reactive } from "vue";
import $ from "jquery";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import Swal from "sweetalert2";
import serviceDescontoGerentes from "./services/descontoDeGerentes.service";
import { iUsuario, iUsuarioComPermissao } from "./interfaces";

export const state = reactive({
    gridUsuarios: <ixGridCreate>{},
    gridUsuariosComPermissao: <ixGridCreate>{},

    modalUsuarios: <iModalCreate>{},
    modalUsuariosComPermissao: <iModalCreate>{},

    dbUsuarioSelecionado: <iUsuario>{},
    loading: false,
    pnSearch: true,
})

export const actions = {
    grids() {
        state.gridUsuarios = new xGridV2.create({
            el: "#pnUsuarios",
            height: 400,
            columns: {
                "Código": { dataField: "COD_FUNCIONARIO", width: "20%" },
                "Nome": { dataField: "NOME_COMP", width: "80%" },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getUsuarios();
                    state.gridUsuarios.querySourceAdd(data);
                }
            },
        });

        state.gridUsuariosComPermissao = new xGridV2.create({
            el: "#pnUsuariosComPermissao",
            height: 400,
            columns: {
                "Código": { dataField: "COD_FUNCIONARIO", width: "20%" },
                "Nome": { dataField: "NOME_COMP", width: "80%" },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getUsuariosComPermissao();
                    state.gridUsuariosComPermissao.querySourceAdd(data);
                }
            },
        });
    },

    criarModais() {
        state.modalUsuarios = new xModal.create({
            height: 400,
            width: 600,
            theme: "xModal-blue",
            el: "#modalUsuarios",
        });

        state.modalUsuariosComPermissao = new xModal.create({
            height: 400,
            width: 600,
            theme: "xModal-blue",
            el: "#modalUsuariosComPermissao",
        });
    },

    init() {
        $(".ss").attr("autocomplete", "off");
        actions.grids();
        actions.criarModais();
    },

    async getUsuarios() {
        try {
            state.loading = true;
            const data = await serviceDescontoGerentes.getUsuarios();
            state.loading = false;
            return data;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar os usuários!"
            });
        }
    },

    async getUsuariosComPermissao() {
        try {
            state.loading = true;
            const data = await serviceDescontoGerentes.getUsuariosComPermissao();
            state.loading = false;
            return data;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao carregar os usuários com permissão!"
            });
        }
    }
};

export default { state, actions };
