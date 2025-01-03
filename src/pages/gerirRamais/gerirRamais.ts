import { nextTick, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iRamal, iSetor, iParamToGetRamal, iParamToInsertRamal, iParamToUpdateRamal } from "./interfaces";
import utils from "@/ts/utils";
import serviceGerirRamais from "./services/gerirRamais.service";
import { useEventListener } from "@vueuse/core";

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    lista: <iRamal[]>[],
    edtSearch: "",
    dbRamal: <iRamal>{},
    setores: <iSetor[]>[],
    lojas: <any[]>[],
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
        await actions.getSetores();
        state.gridPrincipal.queryOpen({ NOME: "" }, () => {
            state.gridPrincipal.focus();
        });
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                Loja: { dataField: "LOJA" },
                Setor: { dataField: "SETOR" },
                Nome: { dataField: "NOME" },
                Ramal: { dataField: "RAMAL", width: "10%", center: true },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getRamais({
                        offset: rs.offset,
                        param: rs.param,
                    });
                    state.gridPrincipal.querySourceAdd(data);
                },
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbRamal = r;
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
                document.getElementById("btnUpdate")?.click();
            },
        });
    },

    async getRamais({ offset, param }: iParamToGetRamal) {
        try {
            state.loading = true;
            const data = await serviceGerirRamais.getRamais({ offset, param });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao exibir os ramais",
                text: "Erro ao carregar ramais.",
            });
        } finally {
            state.loading = false;
        }
    },

    async getSetores() {
        try {
            state.loading = true;
            const data = await serviceGerirRamais.getSetores({ param: {}, offset: 0 });
            state.setores = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao carregar setores",
                text: "Erro ao carregar setores.",
            });
        } finally {
            state.loading = false;
        }
    },

    async btnInsert() {
        state.pnSearch = true;
        state.dbRamal = {} as iRamal;
        await nextTick();
        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
    },

    btnEdit() {
        if (!state.gridPrincipal.dataSource()) {
            Swal.fire({
                icon: "info",
                text: "Nenhum registro selecionado.",
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
                text: "Selecione um registro para excluir.",
            });
            return false;
        }

        if (await msgConfirm("Confirmação", "Deseja excluir o registro?")) {
            await actions.toDelete();
            state.gridPrincipal.focus();
        }
    },

    async btnSave() {
        if (utils.validaOBR()) return false;

        if (!state.dbRamal.NOME || !state.dbRamal.RAMAL) {
            Swal.fire({
                icon: "warning",
                title: "Campos obrigatórios",
                text: "Nome e Ramal são obrigatórios.",
            });
            return false;
        }

        if (state.gridPrincipal.dataSource() === false) {
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
            const id_ramal = state.dbRamal.ID_RAMAL;
            state.loading = true;
            await serviceGerirRamais.toDelete(id_ramal);
            state.gridPrincipal.deleteLine();
            Swal.fire({
                icon: "success",
                text: "Ramal excluído com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao excluir o ramal",
                text: "Erro ao excluir ramal.",
            });
        } finally {
            state.loading = false;
        }
    },

    async toInsert() {
        try {
            state.loading = true;
            const newFields: iParamToInsertRamal = {
                ID_SOCIEDADE: state.dbRamal.ID_SOCIEDADE,
                ID_SETOR: state.dbRamal.ID_SETOR,
                RAMAL: state.dbRamal.RAMAL,
                NOME: state.dbRamal.NOME,
            };

            await serviceGerirRamais.toInsert(newFields);
            state.gridPrincipal.insertLine({ ...newFields });
            Swal.fire({
                icon: "success",
                text: "Ramal inserido com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao inserir ramal.",
            });
        } finally {
            state.loading = false;
        }
    },

    async toUpdate() {
        try {
            const updatedData: iParamToUpdateRamal = {
                ...state.dbRamal,
            };

            state.loading = true;
            await serviceGerirRamais.toUpdate(updatedData);
            state.gridPrincipal.dataSource(updatedData);

            Swal.fire({
                icon: "success",
                text: "Ramal atualizado com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar ramal",
                text: "Erro ao atualizar ramal.",
            });
        } finally {
            state.loading = false;
        }
    },
};

export default { state, actions, eventListener };
