import { nextTick, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iConhecimento, iFieldDuplicity } from "./interfaces";
import utils from "@/ts/utils";
import serviceBancos from "./services/conhecimento.service";


export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    edtSearch: "",
    dbConhecimento: <iConhecimento>{},
    loading: false,
});


export const actions = {
    async init() {
        actions.grids();
        state.gridPrincipal.queryOpen({ DS_BANCO: "" }, () => {
            state.gridPrincipal.focus();
        });
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                "Código": { dataField: "CODIGO" },
                "Descrição": { dataField: "DESCRICAO" },
                "Valor": { dataField: "VALOR" },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getConhecimento({
                        offset: rs.offset,
                        param: rs.param,
                    });

                    state.gridPrincipal.querySourceAdd(data);
                },
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbConhecimento = r;
                },
                duplicity: {
                    dataField: ["CD_BANCO"],
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

    async getConhecimento({ offset, param }: iParamGetBanco) {
        try {
            state.loading = true;
            const data = await serviceBancos.getBancos({ offset, param });

            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao exibir os bancos.",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },


    async search() {
        const searchValue = state.edtSearch?.toUpperCase();

        state.gridPrincipal.queryOpen({
            DS_BANCO: searchValue,
        });

    },

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = await serviceBancos.getDuplicidade({ value, field });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao verificar duplicidade.",
                text: error.message,
            });
        }
    },

    async btnInsert() {
        state.pnSearch = true;
        state.dbConhecimento = {} as iConhecimento
        await nextTick()

        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
    },

    btnEdit() {
        if (!state.gridPrincipal.dataSource()) {
            Swal.fire({
                icon: "info",
                text: "Operação cancelada, nenhum registro selecionado.",
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
                text: "Operação cancelada selecione um registro",
            });
            return false;
        }


        if (await msgConfirm("Confirmação", "Confirma a exclusão?")) {
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
        let linhaGrid = <any>state.gridPrincipal.getIndex()
        await nextTick()

        state.gridPrincipal.enable();
        state.gridPrincipal.focus(linhaGrid);
    },

    async toDelete() {
        try {
            let id_conhecimento = state.dbConhecimento.ID_CONHECIMENTO;

            state.loading = true;

            await serviceBancos.toDelete(id_conhecimento);

            state.gridPrincipal.deleteLine();
            await Swal.fire({
                icon: "success",
                text: "Conhecimento deletado com sucesso.",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao excluir o conhecimento, verificar ",
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
                ID_CONHECIMENTO: state.dbConhecimento.ID_CONHECIMENTO?.toUpperCase(),
                CD_BANCO: state.dbConhecimento.CD_BANCO,
                SG_BANCO: state.dbConhecimento.SG_BANCO?.toUpperCase(),
            };

            await serviceBancos.toInsert(newFields);
            state.gridPrincipal.insertLine({ ...newFields });

            await Swal.fire({
                icon: "success",
                text: "Conhecimento adicionado com sucesso.",
            });

        } catch (error) {
            await Swal.fire({
                icon: "error",
                text: "erro ao adicionar conhecimento.",
            });
        } finally {
            state.loading = false;
        }
    },

    async toUpdate() {
        try {

            let param = {
                ID_CONHECIMENTO: state.dbConhecimento.ID_CONHECIMENTO?.toUpperCase(),
                CD_BANCO: state.dbConhecimento.CD_BANCO,
                SG_BANCO: state.dbConhecimento.SG_BANCO?.toUpperCase(),
            }

            state.loading = true;

            await serviceBancos.toUpdate(param);

            state.gridPrincipal.dataSource(param);

            await Swal.fire({
                icon: "success",
                text: "Conhecimento atualizado com sucesso.",
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar conhecimento!",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },

};

