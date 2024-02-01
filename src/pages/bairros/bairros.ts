import { reactive } from "vue";
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import $ from 'jquery'
import { iBairro, iParamGetBairros, iParamDuplicity } from './interfaces'
import serviceBairros from './services/bairros.service';
import utils from "@/ts/utils";

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    edtSearch: <HTMLInputElement>{},
    dbBairro: <iBairro>{},
    pnSearch: false,
    loading: false
});

export const actions = {
    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                'Descrição': { dataField: "DESCRICAO" },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getBairros({
                        offset: rs.offset,
                        param: rs.param
                    });
                    state.gridPrincipal.querySourceAdd(data);
                }
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbBairro = r;
                },
                duplicity: {
                    dataField: ["DESCRICAO"],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field
                        });

                        if (Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + " já está cadastrada"
                            );
                            return true;
                        }

                        return false;
                    },
                },
                frame: {
                    el: "#pnBotoes",
                    buttons: {
                        novo: {
                            html: "Novo",
                            state: "insert",
                            click: actions.btnInsert
                        },
                        update: {
                            html: "Atualizar",
                            state: "update",
                            click: actions.btnUpdate
                        },
                        excluir: {
                            html: "Excluir",
                            state: "delete",
                            click: actions.btnDelete
                        },
                        salvar: {
                            html: "Salvar",
                            state: "save",
                            click: actions.btnSave,
                            preLoad: "Salvando"
                        },
                        cancelar: {
                            html: "Cancelar",
                            state: "cancel",
                            click: actions.btnCancel,
                        }
                    }
                }
            }
        });
    },

    init() {
        $(".ss").attr("autocomplete", "off");

        state.edtSearch = <any>document.getElementById("edtSearch");

        actions.grids();

        state.gridPrincipal.queryOpen({ DESCRICAO: "" }, () => {
            state.gridPrincipal.focus();
        });
    },

    search() {
        state.gridPrincipal.queryOpen({
            DESCRICAO: state.edtSearch.value.toUpperCase(),
        });
    },

    btnInsert() {
        state.pnSearch = true;

        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
        state.gridPrincipal.clearElementSideBySide();
    },

    btnUpdate() {
        state.pnSearch = true;

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum registro selecionado para alteração, operação cancelada!"
            })
            return false;
        }
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();

    },

    async btnDelete() {
        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum registro selecionado para exclusão, operação cancelada!"
            })
            return false;
        }

        if (await msgConfirm("Confirmação", "Confirma exclusão deste registro?")) {
            await actions.delete()
            state.gridPrincipal.focus();
        }
    },

    async btnSave() {
        if (utils.validaOBR()) {
            return false
        }

        if (await state.gridPrincipal.getDuplicityAll()) {
            return false;
        }

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false) {
            actions.insert();
        } else {
            actions.update();
        }

        state.pnSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    btnCancel() {
        state.pnSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async getBairros({ offset, param }: iParamGetBairros) {
        try {
            state.loading = true;
            const data = await serviceBairros.getBairros({ offset, param });
            state.loading = false;

            return data;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir os bairros!"
            })
        }
    },

    async getDuplicidade({field, value}: iParamDuplicity) {
        try {
            const data = await serviceBairros.getDuplicidade({field, value});
        
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao verificar duplicidade!"
            })
        }
    }

}

export default { state, actions };