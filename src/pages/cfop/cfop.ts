import { nextTick, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iCfop, iParamGetCfop, iFieldDuplicity } from "./interfaces";
import utils from "@/ts/utils";
import serviceCfop from "./services/cfop.service";

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    lista: [] as iCfop[],
    edtSearch: "",
    dbCfop: <iCfop>{},
    loading: false,
});

export const actions = {
    async init() {
        actions.grids();
        actions.getCfop();
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                "CFOP": { dataField: "CFOP" },
                "Descrição": { dataField: "DESCRICAO", width: '60%' },
                "Valor": {
                    dataField: "VALOR", render: utils.formatValor, width: '15%', right: true
                },
                "UF": { dataField: "UF", width: '10%', center: true },
            },

            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbCfop = {
                        ...r,
                        VALOR: utils.formatValor(r.VALOR),
                    };
                },
                duplicity: {
                    dataField: ["CFOP"],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
                        });
                        if (dup && Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(
                                rs.text + " já cadastrado.");
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

    async getCfop() {
        try {
            state.loading = true;
            const param = state.edtSearch?.toUpperCase();

            const data = await serviceCfop.getCfop(param);
            state.gridPrincipal.source(data);
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir os CFOP.",
            });
            return [];
        } finally {
            state.loading = false;
        }
    },

    async search() {
        state.gridPrincipal.clear();
        const data = await actions.getCfop();
        state.gridPrincipal.source(data);
    },

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = await serviceCfop.getDuplicidade({ value, field });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao verificar duplicidade."
            });
        }
    },

    async btnInsert() {
        state.pnSearch = true;
        state.dbCfop = {} as iCfop;
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
        if (state.dbCfop.CFOP?.length < 1) {
            await Swal.fire({
                icon: "warning",
                text: "Código CFOP deve ter mais de 1 caractere.",
            });
            return false;
        }
        if (!state.gridPrincipal.dataSource()) {
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
            let cfop = state.dbCfop.CFOP;
            state.loading = true;
            await serviceCfop.toDelete(cfop);
            state.gridPrincipal.deleteLine();
            await Swal.fire({
                icon: "success",
                text: "CFOP deletado com sucesso.",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir o CFOP.",
            });
        } finally {
            state.loading = false;
        }
    },

    async toInsert() {
        try {
            state.loading = true;
            let newFields = {
                CFOP: state.dbCfop.CFOP,
                DESCRICAO: state.dbCfop.DESCRICAO?.toUpperCase(),
                VALOR: utils.formatValorUSA(state.dbCfop.VALOR.toString()),
                UF: state.dbCfop.UF.toUpperCase(),
            };
            await serviceCfop.toInsert(newFields);
            state.gridPrincipal.insertLine({ ...newFields });
            await Swal.fire({
                icon: "success",
                text: "CFOP adicionado com sucesso.",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                text: "Erro ao adicionar CFOP.",
            });
        } finally {
            state.loading = false;
        }
    },

    async toUpdate() {
        try {
            let param = {
                CFOP: state.dbCfop.CFOP,
                DESCRICAO: state.dbCfop.DESCRICAO?.toUpperCase(),
                VALOR: utils.formatValorUSA(state.dbCfop.VALOR.toString()),
                UF: state.dbCfop.UF?.toUpperCase(),
            };
            state.loading = true;
            await serviceCfop.toUpdate(param);
            state.gridPrincipal.dataSource(param);
            await Swal.fire({
                icon: "success",
                text: "CFOP atualizado com sucesso.",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar CFOP!",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },
};


