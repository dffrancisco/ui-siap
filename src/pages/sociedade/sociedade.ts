import { nextTick, reactive, ref } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iSociedade, iFieldDuplicity, iUpdateSociedadeParam, iCliente } from "./interfaces";
import utils from "@/ts/utils";
import serviceSociedade from "./services/sociedade.service";
import { useEventListener } from "@vueuse/core";

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    gridSociedadeDetalhada: <ixGridCreate>{},
    pnSearch: false,
    lista: <iSociedade[]>[],
    desativarInputs: true,
    edtSearch: "",
    dbSociedade: <iSociedade>{},
    loading: false,
    PausabuscaSociedade: false,
    idCliente: <number>null,
    modalClienteOpened: false,
    clienteSelecionado: <iCliente>{},
    regimeOptions: [
        { label: 'SIMPLES', value: 'S' },
        { label: 'REAL', value: 'R' },
        { label: 'PRESUMIDO', value: 'L' }
    ],
    spedOptions: ["Sim", "Não"]
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
        actions.getSociedade()
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                "Sociedade": { dataField: "NOME", left: true, width: '60%' },
                "CNPJ": { dataField: "CNPJ", left: true },
            },


            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbSociedade = r;
                },

                duplicity: {
                    dataField: ["CNPJ"],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
                        });
                        if (dup && Object.keys(dup).length > 0) {
                            state.gridPrincipal.showMessageDuplicity(rs.text + " já cadastrado!");
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

    salvarClienteSelecionadoNaState(clienteSelecionado: iCliente) {
        state.clienteSelecionado = clienteSelecionado;
        actions.popularStates(clienteSelecionado)
    },

    popularStates(clienteSelecionado: iCliente) {
        state.dbSociedade.NOME = clienteSelecionado.NOME
        state.dbSociedade.CNPJ = clienteSelecionado.CGC_CLIENTE
    },

    cancelar() {
        state.desativarInputs = true;

        if (state.idCliente) {
            actions.popularStates(state.clienteSelecionado)
        }
    },

    async getSociedade() {

        if (state.PausabuscaSociedade) return;
        try {
            state.loading = true;
            const data = await serviceSociedade.getSociedade(state.edtSearch);

            state.gridPrincipal.source(data);
            state.PausabuscaSociedade = true;
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir registro de sociedade",
            });
        } finally {
            state.loading = false;
        }
    },
    async search() {

        state.PausabuscaSociedade = false;
        state.gridPrincipal.clear && state.gridPrincipal.clear();
        await actions.getSociedade();
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
                icon: "warning",
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
                icon: "warning",
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
            let id_sociedade = state.dbSociedade.ID_SOCIEDADE;
            state.loading = true;
            await serviceSociedade.toDelete(id_sociedade);
            state.gridPrincipal.deleteLine();
            await Swal.fire({
                icon: "success",
                text: "Sociedade excluída com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao executar exclusão",
            });
        } finally {
            state.loading = false;
        }
    },

    async toInsert() {
        try {
            state.loading = true;
            let newFields = {
                ID_CLIENTE: state.clienteSelecionado.ID_CLIENTE,
                CAMINHO_SERVIDOR: state.dbSociedade.CAMINHO_SERVIDOR,
                CNPJ: state.dbSociedade.CNPJ,
                HOST: state.dbSociedade.HOST,
                BANCO: state.dbSociedade.BANCO,
                GERA_SPED: state.dbSociedade.GERA_SPED,
                REGIME: state.dbSociedade.REGIME,
                FANTASIA: state.dbSociedade.FANTASIA,
                ID_EMPRESA: state.dbSociedade.ID_EMPRESA,
                NOME: state.dbSociedade.NOME,
                ID_SOCIEDADE: state.dbSociedade.ID_SOCIEDADE
            };
            await serviceSociedade.toInsert(newFields);
            state.gridPrincipal.insertLine({ ...newFields });
            await Swal.fire({
                icon: "success",
                text: "Sociedade adicionada com sucesso!",
            });
            await actions.getSociedade();
        } catch (error) {
            await Swal.fire({
                icon: "error",
                text: "Erro ao adicionar sociedade",
            });
        } finally {
            state.loading = false;
        }
    },

    async toUpdate() {
        try {
            let param: iUpdateSociedadeParam = {
                ID_CLIENTE: state.dbSociedade.ID_CLIENTE,
                CAMINHO_SERVIDOR: state.dbSociedade.CAMINHO_SERVIDOR,
                CNPJ: state.dbSociedade.CNPJ,
                BANCO: state.dbSociedade.BANCO,
                HOST: state.dbSociedade.HOST,
                GERA_SPED: state.dbSociedade.GERA_SPED,
                REGIME: state.dbSociedade.REGIME,
                FANTASIA: state.dbSociedade.FANTASIA,
                ID_EMPRESA: state.dbSociedade.ID_EMPRESA,

            };
            state.loading = true;
            await serviceSociedade.toUpdate(param);
            state.gridPrincipal.dataSource(param);
            await Swal.fire({
                icon: "success",
                text: "Sociedade atualizada com sucesso!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar a sociedade!",
                text: error.message,
            });
        } finally {
            state.loading = false;
        }
    },


}