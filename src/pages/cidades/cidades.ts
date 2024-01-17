
import { reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import { iCidade, iUF, iParamGetCidades, iFieldDuplicity } from "./interfaces";
import serviceCidades from "./services/cidades.service";
import utils from "@/ts/utils";

interface _ixGridCreate extends ixGridCreate {
    dataSource: (obj?: object) => iCidade;
}

export const state = reactive({
    gridPrincipal: <_ixGridCreate>{},
    pnSearch: false,
    listaUF: <iUF[]>[],
    edtSearch: <HTMLInputElement>{},
    dbCidade: <iCidade>{},
    loading: false
});

export const actions = {
    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                Descrição: { dataField: "DESCRICAO" },
                UF: { dataField: "UF", width: "10%" },
                "Cód. IBGE": { dataField: "COD_IBGE", width: "10%" },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getCidades({
                        offset: rs.offset,
                        param: rs.param,
                    });
                    state.gridPrincipal.querySourceAdd(data);
                },
            },

            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbCidade = r;
                },
                duplicity: {
                    dataField: ["DESCRICAO", "COD_IBGE"],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
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

    async getCidades({ offset, param }: iParamGetCidades) {
        try {
            state.loading = true;
            const data = await serviceCidades.getCidades({ offset, param });

            state.loading = false
            return data;
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir as cidades!",
            });
        }
    },

    search() {
        state.gridPrincipal.queryOpen({
            DESCRICAO: state.edtSearch.value.toUpperCase(),
        });
    },

    digitarApenasNumeros(value) {
        if (value) {
            value.target.value = value.target.value.replace(/[^0-9]/g, "");
            state.dbCidade.COD_IBGE = value.target.value
        }
    },

    async getUF() {
        try {
            const data = serviceCidades.getUF();

            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir as UF!",
            });
        }
    },

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            const data = serviceCidades.getDuplicidade({ value, field });

            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Cidade já cadastrada!",
            });
        }
    },

    btnInsert() {
        state.pnSearch = true;

        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
        state.gridPrincipal.clearElementSideBySide();
    },

    btnEdit() {
        //@ts-ignore
        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: "info",
                text: "Nenhum registro selecionado para alteração, operação cancelada!",
            });
            return false;
        }
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
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

    async btnSave() {
        if (utils.validaOBR()) return false;

        if (await state.gridPrincipal.getDuplicityAll()) return false;

        if (state.dbCidade.COD_IBGE.length < 7) {
            await Swal.fire({
                icon: "error",
                text: "O Código IBGE não pode ter menos de 7 números!",
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

        state.gridPrincipal.enable();

        state.pnSearch = false;
        state.gridPrincipal.focus();
    },

    btnCancel() {
        state.pnSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async toDelete() {
        try {
            let cod_cidade = state.dbCidade.COD_CIDADE

            state.loading = true
            await serviceCidades.toDelete(cod_cidade);
            state.loading = false
            state.gridPrincipal.deleteLine();
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir cidade! Talvez ela esteja sendo utilizada em outro local.",
            });
        }
    },

    async toInsert() {
        try {
            let newFields = <any>(
                state.gridPrincipal.getElementSideBySideJson(true, false)
            );

            state.loading = true
            await serviceCidades.toInsert(newFields);
            state.loading = false

            state.gridPrincipal.insertLine(newFields);

        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao inserir cidade!",
            });
        }
    },

    async toUpdate() {

        try {

            let dadosDiff = state.gridPrincipal.getDiffTwoJson(true, false);

            if (dadosDiff.diff == false) {
                return
            }

            let dadosAtualizados = {
                ...state.dbCidade,
                ...dadosDiff.new
            }

            state.loading = true
            await serviceCidades.toUpdate(dadosAtualizados);
            state.loading = false

            state.dbCidade = dadosAtualizados as iCidade;
            state.gridPrincipal.dataSource(dadosAtualizados);

        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao atualizar cidade!",
            });
        }
    }
};

export default { state, actions };
