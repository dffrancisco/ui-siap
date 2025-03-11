import { nextTick, reactive, ref } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iConhecimento, iFieldDuplicity } from "./interfaces";
import utils from "@/ts/utils";
import { useEventListener } from "@vueuse/core";
import serviceConhecimento from "./services/conhecimento.service";

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    edtSearch: "",
    dbConhecimento: <iConhecimento>{},
    loading: false,
});

export const eventListener = useEventListener(document, "keydown", async (event) => {
    if (event.key === "F1") {
        document.getElementById("edtSearch")?.focus();
        event.preventDefault();
        event.stopPropagation();
    }
});

export const actions = {
    async init() {
        actions.grids();
        actions.getConhecimento();
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: false,
            columns: {
                "Código": { dataField: "ID_CONHECIMENTO", right: true, width: '7%' },
                "Descrição": { dataField: "DESCRICAO", left: true, width: '80%' },
                "Valor": { dataField: "VALOR", right: true, render: utils.formatValor },
            },

            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbConhecimento = {
                        ...r,
                        VALOR: utils.formatValor(r.VALOR),
                    };
                },
                duplicity: {
                    dataField: ["ID_CONHECIMENTO", "DESCRICAO"],
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

    async getConhecimento() {
        try {
            state.loading = true;
            const param = state.edtSearch?.toUpperCase();

            const data = await serviceConhecimento.getConhecimento(param);
            state.gridPrincipal.source(data);
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir registro de Conhecimento",
            });
            return [];
        } finally {
            state.loading = false;
        }
    },

    async search() {
        state.gridPrincipal.clear();
        const data = await actions.getConhecimento();
        state.gridPrincipal.source(data);
    },

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = await serviceConhecimento.getDuplicidade({ value, field });
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

            await serviceConhecimento.toDelete(id_conhecimento);

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
                ID_CONHECIMENTO: state.dbConhecimento.ID_CONHECIMENTO,
                DESCRICAO: state.dbConhecimento.DESCRICAO.toUpperCase(),
                VALOR: utils.formatValorUSA(state.dbConhecimento.VALOR.toString())
            };

            await serviceConhecimento.toInsert(newFields);
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
                ID_CONHECIMENTO: state.dbConhecimento.ID_CONHECIMENTO,
                DESCRICAO: state.dbConhecimento.DESCRICAO.toUpperCase(),
                VALOR: utils.formatValorUSA(state.dbConhecimento.VALOR.toString())
            }

            state.loading = true;

            await serviceConhecimento.toUpdate(param);

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

