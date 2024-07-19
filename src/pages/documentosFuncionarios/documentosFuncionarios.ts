import { nextTick, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import { iDocumentosFuncionarios, iParamGetDocumentosFuncionarios, iFieldDuplicity } from "./interfaces";
import serviceDocumentosFuncionarios from "./service/documentos_funcionarios.service";

interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iDocumentosFuncionarios;
}

export const state = reactive({
    gridPrincipal: <_ixGridCreate>{},
    pnSearch: false,
    edtSearch: <HTMLInputElement>{},
    dbDocumentosFuncionarios: <iDocumentosFuncionarios>{},
    loading: false,
});

export const actions = {
    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                Descrição: { dataField: "descricao" },
                Pasta: { dataField: "pasta" },
                Controle: { dataField: "controle", compare: "returnControle" }
            },
            query: {
                async execute(rs) {
                    let data = await actions.getDocumentosFuncionarios({
                        offset: rs.offset,
                        param: rs.param
                    });
                    state.gridPrincipal.querySourceAdd(data)
                },
            },
            compare: {
                returnControle: (r) => {
                    if (r.controle == 1)
                        return "Penalidades"
                    else
                        return "Documentos"
                },
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbDocumentosFuncionarios = { ...r }
                },
                duplicity: {
                    dataField: ['descricao'],
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

    search() {
        state.gridPrincipal.queryOpen({
            descricao: state.edtSearch.value.toUpperCase()
        });
    },

    async btnInsert() {
        state.pnSearch = true;
        state.dbDocumentosFuncionarios = {} as iDocumentosFuncionarios
        await nextTick()

        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnEdit() {
        //@ts-ignore
        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: "info",
                text: "Nenhum registro selecionado para alteração, operação cancelada!",
            });
            return false;
        }
        state.pnSearch = true;
        await nextTick()

        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnSave() {
        if (utils.validaOBR()) return false;

        if (await state.gridPrincipal.getDuplicityAll()) return false;

        const verificarCaracterEspecial = /[^a-zA-Z0-9_]/u.test(state.dbDocumentosFuncionarios.pasta);
        if (verificarCaracterEspecial) {
            Swal.fire({
                icon: "error",
                text: "O campo pasta contém caracteres especiais. Por favor, ajuste.",
            });
            return false;
        }

        //@ts-ignore
        if (state.gridPrincipal.dataSource() == false) {
            actions.toInsert();
        }
        else {
            actions.toUpdate();
        }

        state.pnSearch = false;
        await nextTick()

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

    async btnDelete() {
        //@ts-ignore
        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: "info",
                text: "Nenhum registro selecionado para alteração, operação cancelada!",
            });
            return false;
        }

        if (await msgConfirm("Confirmação", "Confirma exclusão deste registro?")) {
            await actions.toDelete();
            state.gridPrincipal.focus();
        }
    },

    async getDocumentosFuncionarios({ offset, param }: iParamGetDocumentosFuncionarios) {
        try {
            state.loading = true
            const data = await serviceDocumentosFuncionarios.getDocumentosFuncionarios({ offset, param })
            state.loading = false

            return data
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir os documentos!",
            });
        }
    },

    async getDuplicidade({ field, value }: iFieldDuplicity) {
        try {
            const data = serviceDocumentosFuncionarios.getDuplicidade({ value, field });

            return data
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Documento já cadastrado!",
            });
        }
    },

    async toInsert() {
        try {
            let newFields = <any>state.gridPrincipal.getElementSideBySideJson(false);

            newFields.descricao = utils.toCapitalize(newFields.descricao)
            newFields.pasta = utils.toLowerCase(newFields.pasta)
            // Substitui espaços por underline
            newFields.pasta.replace(/\s+/g, '_');

            state.loading = true,
                await serviceDocumentosFuncionarios.toInsert(newFields);
            state.loading = false

            state.gridPrincipal.insertLine(newFields)
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao inserir documento!",
            });
        }
    },

    async toUpdate() {
        try {
            let dadosDiff = state.gridPrincipal.getDiffTwoJson(false);

            if (dadosDiff.diff == false) {
                return
            }

            let dadosAtualizados = {
                ...state.dbDocumentosFuncionarios,
                ...dadosDiff.new
            }

            dadosAtualizados.descricao = utils.toCapitalize(dadosAtualizados.descricao)
            dadosAtualizados.pasta = utils.toLowerCase(dadosAtualizados.pasta)

            // Substitui espaços por underline
            dadosAtualizados.pasta = dadosAtualizados.pasta.replace(/\s+/g, '_');

            state.loading = true
            await serviceDocumentosFuncionarios.toUpdate(dadosAtualizados);
            state.loading = false

            state.dbDocumentosFuncionarios = dadosAtualizados as iDocumentosFuncionarios;
            state.gridPrincipal.dataSource(dadosAtualizados)
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao atualizar documento!",
            });
        }
    },

    async toDelete() {
        try {
            let id = state.dbDocumentosFuncionarios.id_tipo_pasta_docs_funcionarios;

            state.loading = true
            await serviceDocumentosFuncionarios.toDelete(id);
            state.loading = false
            state.gridPrincipal.deleteLine()
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir documento!",
            });
        }
    }



}
