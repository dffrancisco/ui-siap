
import { nextTick, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iSociedade, iFieldDuplicity, iParamToUpdate } from "./interfaces";
import utils from "@/ts/utils";
import serviceSociedade from "./services/sociedade.service";
import { useEventListener } from "@vueuse/core";

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    lista: <iSociedade[]>[],
    edtSearch: "",
    dbSociedade: <iSociedade>{},
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
        state.gridPrincipal.queryOpen({ ID_SOCIEDADE: "" }, () => {
            state.gridPrincipal.focus();
        });
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                "Sociedade": { dataField: "ID_SOCIEDADE", width: '10%', center: true },
                "CNPJ": { dataField: "CNPJ", width: '10%', center: true },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getSociedade({
                        offset: rs.offset,
                        param: rs.param,
                    });
                    state.gridPrincipal.querySourceAdd(data);
                },
            },

            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbSociedade = r;
                },
                duplicity: {
                    dataField: ["ID_SOCIEDADE"],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
                        });
                        if (dup && Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + " já cadastrado!"
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
                document.getElementById("btnUpdate")?.click();
            },
        });
    },

    async getSociedade({ offset, param }: { offset: number, param: string }) {
        try {
            state.loading = true;
            const data = await serviceSociedade.getSociedades({ offset, param });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao exibir os favorecidos",
                text: "erro ao exibir registro de favorecidos",
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
            if (!value) {
                return null;
            }
            const data = await serviceSociedade.getDuplicidade({ value, field });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao verificar duplicidade!",
                text: "Erro ao executar verificação de duplicidade",
            });
        }
    },

    async btnInsert() {
        state.pnSearch = true;
        state.dbSociedade = {} as iSociedade;
        await nextTick();
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
                text: "Operação cancelada, selecione um registro.",
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
        let linhaGrid = <any>state.gridPrincipal.getIndex();
        await nextTick();
        state.gridPrincipal.enable();
        state.gridPrincipal.focus(linhaGrid);
    },

    async toDelete() {
        try {
            let id_Favorecido = state.dbSociedade.ID_SOCIEDADE;
            state.loading = true;

            await serviceSociedade.toDelete(id_Favorecido);
            state.gridPrincipal.deleteLine();
            await Swal.fire({
                icon: "success",
                text: "Favorecido excluído com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao excluir o favorecido.",
                text: "erro ao executar exclusão",
            });
        } finally {
            state.loading = false;
        }
    },

    async toInsert() {
        try {
            state.loading = true;

            let newFields = {
                ID_CLIENTE: state.dbSociedade.ID_CLIENTE,
                NOME: state.dbSociedade.NOME,
                CAMINHO_SERVIDOR: state.dbSociedade.CAMINHO_SERVIDOR,
                ID_EMPRESA: state.dbSociedade.ID_EMPRESA,
                CNPJ: state.dbSociedade.CNPJ,
                HOST: state.dbSociedade.HOST,
                BANCO: state.dbSociedade.BANCO,
                GERA_SPED: state.dbSociedade.GERA_SPED,
                REGIME: state.dbSociedade.REGIME,
                FANTASIA: state.dbSociedade.FANTASIA,
            };

            await serviceSociedade.toInsert(newFields);
            state.gridPrincipal.insertLine({ ...newFields });
            await Swal.fire({
                icon: "success",
                text: "Favorecido adicionado com sucesso!",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                text: "Erro ao adicionar favorecido",
            });
        } finally {
            state.loading = false;
        }
    },

    async toUpdate() {
        try {
            let param: iParamToUpdate = {
                ID_SOCIEDADE: state.dbSociedade.ID_SOCIEDADE,
                ID_CLIENTE: state.dbSociedade.ID_CLIENTE,
                NOME: state.dbSociedade.NOME,
                CAMINHO_SERVIDOR: state.dbSociedade.CAMINHO_SERVIDOR,
                ID_EMPRESA: state.dbSociedade.ID_EMPRESA,
                CNPJ: state.dbSociedade.CNPJ,
                HOST: state.dbSociedade.HOST,
                BANCO: state.dbSociedade.BANCO,
                GERA_SPED: state.dbSociedade.GERA_SPED,
                REGIME: state.dbSociedade.REGIME,
                FANTASIA: state.dbSociedade.FANTASIA,
            };

            state.loading = true;

            await serviceSociedade.toUpdate(param);

            state.gridPrincipal.dataSource(param);

            await Swal.fire({
                icon: "success",
                text: "Favorecido atualizado com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar favorecido!",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    }
};

export default { state, actions, eventListener };
