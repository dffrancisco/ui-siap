
import { nextTick, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iFavorecidos, iParamGetFavorecido, iFieldDuplicity, iBanco } from "./interfaces";
import utils from "@/ts/utils";
import serviceFavorecidos from "./services/favorecidos.service";
import { useEventListener } from "@vueuse/core";

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    lista: <iFavorecidos[]>[],
    edtSearch: "",
    dbFavorecido: <iFavorecidos>{},
    loading: false,
    bancos: <iBanco[]>[],
    vinculoMap: {
        AD: "Administrativo",
        OP: "Operacional",
        RH: "Pessoal",
    },
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
                "Banco": { dataField: "CD_BANCO", width: '10%', center: true },
                "Agência": { dataField: "CD_AGENCIA", width: '10%', center: true },
                "Conta": { dataField: "NR_CONTA", width: '16%' },
                "Matriz": { dataField: "NM_MATRIZ" },
                "Vínculo": { dataField: "TP_VINCULO", width: '8%', center: true },
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

    async getFavorecido({ offset, param }: iParamGetFavorecido) {
        try {
            state.loading = true;
            const data = await serviceFavorecidos.getFavorecidos({ offset, param });
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

    async getBancos() {
        try {
            state.loading = true;
            const data = await serviceFavorecidos.getBancos();
            state.bancos = data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao carregar os bancos",
                text: "erro ao carregar bancos",
            });
        } finally {
            state.loading = false;
        }
    },

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = await serviceFavorecidos.getDuplicidade({ value, field });
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
        //@ts-ignore
        state.dbFavorecido = {} as iFavorecidos;
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
        //@ts-ignore
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

        if (!state.dbFavorecido.NR_CPF && !state.dbFavorecido.NR_CNPJ) {
            await Swal.fire({
                icon: "warning",
                title: "Campo obrigatório!",
                text: "CPF ou CNPJ deve ser preenchido.",
            });
            return false
        }



        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false) {
            if (await state.gridPrincipal.getDuplicityAll()) {
                return false;
            }
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
                NM_FAVORECIDO: state.dbFavorecido.NM_FAVORECIDO?.toUpperCase(),
                CD_BANCO: state.dbFavorecido.CD_BANCO,
                CD_AGENCIA: state.dbFavorecido.CD_AGENCIA,
                NR_CONTA: state.dbFavorecido.NR_CONTA,
                NM_MATRIZ: state.dbFavorecido.NM_MATRIZ,
                TP_VINCULO: state.dbFavorecido.TP_VINCULO,
                ID_FAVORECIDO: state.dbFavorecido.ID_FAVORECIDO,
                CD_OPERACAO: state.dbFavorecido.CD_OPERACAO,
                NR_CPF: state.dbFavorecido.NR_CPF || null,
                NR_CNPJ: state.dbFavorecido.NR_CNPJ || null,
            };

            await serviceFavorecidos.toInsert(newFields);
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
            let dadosDiff = state.gridPrincipal.getDiffTwoJson(true, false);

            if (dadosDiff.diff == false) {
                return
            }

            let dadosAtualizados = {
                ...state.dbFavorecido,
                ...dadosDiff.new
            };

            dadosAtualizados.NM_FAVORECIDO = utils.toCapitalize(dadosAtualizados.NM_FAVORECIDO);
            dadosAtualizados.CD_BANCO = dadosAtualizados.CD_BANCO.toUpperCase();

            state.loading = true;

            await serviceFavorecidos.toUpdate(dadosAtualizados);
            state.gridPrincipal.dataSource(dadosAtualizados);
            state.dbFavorecido = dadosAtualizados
            state.loading = false;

            await Swal.fire({
                icon: "success",
                text: "Favorecido atualizado com sucesso!",
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                text: "Erro ao atualizar registro!",
            });
        }
    }
};

export default { state, actions, eventListener };
