import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iCarros, iProdutoMontagem } from "./interfaces";
import utils from "@/ts/utils";

interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iProdutoMontagem
}

export const state = reactive(({
    gridPrincipal: <_ixGridCreate>{},
    pnSearch: false,
    listaCarros: <iCarros[]>[],
    edtSearch: <HTMLInputElement>{},
    dbProdutoMontagem: <iProdutoMontagem>{},
    loading: false
}))

export const actions = {
    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                "Descrição Montagem": { dataField: "DESC_MONTAGEN"},
                "Carro": { dataField: "ID_CARRO" },
                "Valor": { dataField: "VALOR" }
            },
            query: {
                async execute(rs) {
                    let data = await actions.getProdutos({
                        offset: rs.offset,
                        param: rs.param
                    });
                    state.gridPrincipal.querySourceAdd(data);
                }
            },
            sideBySide: {
                el: '#pnCampos',
                vModel(r) { state.dbProdutoMontagem = r },
                frame: {
                    el: '#pnBotoes',
                    buttons: {
                        novo: {
                            html: 'Novo',
                            state: 'insert',
                            click: actions.btnInsert
                        },

                        update: {
                            html: 'Alterar',
                            state: 'update',
                            click: actions.btnEdit,
                            id: 'btnUpdate'
                        },

                        excluir: {
                            html: 'Excluir',
                            state: 'delete',
                            click: actions.btnDelete
                        },

                        salvar: {
                            html: 'Salvar',
                            state: 'save',
                            click: actions.btnSave,
                            preLoad: 'Salvando',
                        },

                        cancela: {
                            html: 'Cancelar',
                            state: 'cancel',
                            click: actions.btnCancel
                        }
                    }

                }
            },

            enter: function () {
                document.getElementById('btnUpdate').click()
            }
        });
    },

    search() {
        state.gridPrincipal.queryOpen({
            DESCRICAO: state.edtSearch.value.toUpperCase()
        });
    },

    btnInsert() {
        state.pnSearch = true;

        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
        state.gridPrincipal.clearElementSideBySide();
    },

    btnEdit() {
        //@ts-ignore
        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: "info",
                text: "Nenhum registro selecionado para alteração, operação cancelada!"
            })
            return false;
        }
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnDelete() {
        //@ts-ignore
        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: "info",
                text: "Nenhum registro selecionado para exclusão, operação cancelada!"
            })
            return false;
        }

        if (await msgConfirm("Confirmação", "Confirma exclusão deste registro?")) {
            await actions.toDelete();
            state.gridPrincipal.focus();
        }
    },

    async btnSave() {
        if (utils.validaOBR())
            return false;

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false)
            actions.toInsert();
        else {
            actions.toUpdate();
        }

        state.gridPrincipal.enable();

        state.pnSearch = false;
        state.gridPrincipal.focus();
    },

    btnCancel() {
        state.pnSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async getProdutos ({param, offset}) {

    },

    async getCarros () {

    },

    async toInsert() {

    },

    async toUpdate() {

    },

    async toDelete() {

    },
}





export default { state, actions }