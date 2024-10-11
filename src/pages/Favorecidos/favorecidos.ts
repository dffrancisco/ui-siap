import { nextTick, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iFavorecidos, iParamGetFavorecido, iFieldDuplicity } from "./interfaces";
import utils from "@/ts/utils";
import serviceFavorecidos from "./services/favorecidos.service";


export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    lista: <iFavorecidos[]>[],
    edtSearch: "",
    dbFavorecido: <iFavorecidos>{},
    loading: false,
});

export const actions = {
    async init() {
        actions.grids();
        state.gridPrincipal.queryOpen({ NM_FAVORECIDO: "" }, () => {
            state.gridPrincipal.focus();
        });
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                "Nome do Favorecido": { dataField: "NM_FAVORECIDO" },
                "Banco": { dataField: "CD_BANCO" },
                "Agência": { dataField: "CD_AGENCIA" },
                "Conta": { dataField: "NR_CONTA" },
                "Matriz": { dataField: "NM_MATRIZ" },
                "Vínculo": { dataField: "TP_VINCULO" },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getFavorecido({
                        offset: rs.offset,
                        param: rs.param,
                    });

                    state.gridPrincipal.querySourceAdd(data);
                },
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbFavorecido = r;
                },
                duplicity: {
                    dataField: ["NR_CPF", "NR_CNPJ"],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
                        });

                        if (dup && Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + " já cadastrado."
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
                            click: actions.btnInsert,
                        },
                        update: {
                            html: "Alterar",
                            state: "update",
                            click: actions.btnEdit,
                            id: "btnUpdate",
                        },
                        excluir: {
                            html: "Excluir",
                            state: "delete",
                            click: actions.btnDelete,
                        },
                        salvar: {
                            html: "Salvar",
                            state: "save",
                            click: actions.btnSave,
                            preLoad: "Salvando",
                        },
                        cancela: {
                            html: "Cancelar",
                            state: "cancel",
                            click: actions.btnCancel,
                        },
                    },
                },
            },
            enter: function () {
                document.getElementById("btnUpdate").click();
            },
        });
    },



    async getFavorecido({ offset, param }: iParamGetFavorecido) {
        try {
            state.loading = true;
            const data = await serviceFavorecidos.getFavorecidos({ offset, param });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "erro ao exibir os favorecidos",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },

    async search() {
        const searchValue = state.edtSearch?.toUpperCase();

        state.gridPrincipal.queryOpen({
            NM_FAVORECIDO: searchValue,
        });
    },

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = await serviceFavorecidos.getDuplicidade({ value, field });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "erro ao verificar duplicidede",
                text: error.message,
            });
        }
    },

    async btnInsert() {
        state.pnSearch = true;
        state.dbFavorecido = {} as iFavorecidos;
        await nextTick();

        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
    },

    btnEdit() {
        if (!state.gridPrincipal.dataSource()) {
            Swal.fire({
                icon: "info",
                text: "operação condcelada, nenhum registro selecionado.",
            });
            return false;
        }
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnDelete() {
        if (!state.gridPrincipal.dataSource()) {
            Swal.fire({
                icon: "info",
                text: "operação cancelada, selecione um registro.",
            });
            return false;
        }

        if (await msgConfirm("confirmação", "Confirma a exclusão?")) {
            await actions.toDelete();
            state.gridPrincipal.focus();
        }
    },

    async btnSave() {
        if (utils.validaOBR()) {
            return false;
        }

        if (await state.gridPrincipal.getDuplicityAll()) {
            return false;
        }

        if (state.gridPrincipal.dataSource() == false) {
            actions.toInsert();
        } else {
            actions.toUpdate();
        }

        state.pnSearch = false;
        await nextTick();

        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async btnCancel() {
        state.pnSearch = false;
        let linhaGrid = <any>state.gridPrincipal.getIndex();
        await nextTick();

        state.gridPrincipal.enable();
        state.gridPrincipal.focus(linhaGrid);

    },

    async toDelete() {
        try {
            let id_Favorecido = state.dbFavorecido.ID_FAVORECIDO;

            state.loading = true;

            await serviceFavorecidos.toDelete(id_Favorecido);

            state.gridPrincipal.deleteLine();
            await Swal.fire({
                icon: "success",
                text: "favorecido excluido com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "erro ao excluir o favorecido.",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },

    async toInsert() {
        try {
            state.loading = true;

            let newFields = {
                NM_FAVORECIDO: state.dbFavorecido.NM_FAVORECIDO?.toUpperCase(),
                CD_BANCO: state.dbFavorecido.CD_BANCO,
                CD_AGENCIA: state.dbFavorecido.CD_AGENCIA,
                NR_CONTA: state.dbFavorecido.NR_CONTA,
                NM_MATRIZ: state.dbFavorecido.NM_MATRIZ,
                TP_VINCULO: state.dbFavorecido.TP_VINCULO,
                ID_FAVORECIDO: state.dbFavorecido.ID_FAVORECIDO,
                CD_OPERACAO: state.dbFavorecido.CD_OPERACAO,
                NR_CPF: state.dbFavorecido.NR_CPF,
                NR_CNPJ: state.dbFavorecido.NR_CNPJ,
            };

            await serviceFavorecidos.toInsert(newFields);
            state.gridPrincipal.insertLine({ ...newFields });
            await Swal.fire({
                icon: "success",
                text: "favorecido adicionado com sucesso!",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                text: "erro ao adicionar favorecido",
            });
        } finally {
            state.loading = false;
        }
    },


    async toUpdate() {
        try {
            let param = {
                NM_FAVORECIDO: state.dbFavorecido.NM_FAVORECIDO?.toUpperCase(),
                CD_BANCO: state.dbFavorecido.CD_BANCO,
                CD_AGENCIA: state.dbFavorecido.CD_AGENCIA,
                CD_OPERACAO: state.dbFavorecido.CD_OPERACAO,
                NR_CONTA: state.dbFavorecido.NR_CONTA,
                NM_MATRIZ: state.dbFavorecido.NM_MATRIZ,
                TP_VINCULO: state.dbFavorecido.TP_VINCULO,
            };

            state.loading = true;


            serviceFavorecidos.toUpdate(param);
            state.gridPrincipal.dataSource(param);

            await Swal.fire({
                icon: "success",
                text: "favorecido atualizado com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "erro atualizar favorecido!",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },


};

export default { state, actions };
