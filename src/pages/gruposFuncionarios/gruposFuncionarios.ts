import { reactive } from "vue";
import {
    iGrupo,
    iParamDeleteGrupoImpressao,
    iParamGetDuplicityGrupoImpressao,
    iParamGetGruposImpressao,
    iParamInsertGrupoImpressao,
    iParamUpdateGrupoImpressao
} from "./interfaces";
import Swal from "sweetalert2";
import serviceGruposFuncionarios from './services/gruposFuncionarios.service'
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';
import xModal, { iModalCreate } from "@/plugins/xModal/xModal";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";

export const state = reactive({
    gridGruposFuncionarios: <ixGridCreate>{},

    modalAddFuncionariosGrupo: <iModalCreate>{},
    modalAddFuncionariosGrupoOpened: false,

    dbGrupo: <iGrupo>{},

    loading: false,
})

export const actions = {
    criarGrid() {
        state.gridGruposFuncionarios = new xGridV2.create({
            el: "#gridGruposFuncionarios",
            height: 250,
            count: true,
            columns: {
                GRUPOS: { dataField: "NOME" },
            },
            query: {
                async execute(rs) {
                    let data = await actions.getGruposImpressao({
                        offset: rs.offset,
                        param: rs.param
                    });
                    state.gridGruposFuncionarios.querySourceAdd(data)
                }
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) { state.dbGrupo = { ...r } },
                duplicity: {
                    dataField: ["NOME"],
                    async execute(rs) {
                        let dup = await actions.getDuplicityGrupoImpressao({
                            value: rs.value.toUpperCase(),
                            field: rs.field,
                        });

                        if (Object.keys(dup).length > 0) {
                            state.gridGruposFuncionarios.showMessageDuplicity(
                                rs.text + " já está cadastrada"
                            );
                            return true;
                        }

                        return false;
                    },
                },
                frame: {
                    el: '#pnBotoes',
                    buttons: {
                        novo: {
                            html: "Novo",
                            state: "insert",
                            click: actions.btnInsert
                        },
                        update: {
                            html: "Alterar",
                            state: "update",
                            click: actions.btnUpdate,
                            id: "btnUpdate",
                        },
                        addFuncionario: {
                            html: "Adicionar Funcionários",
                            state: "select",
                            click: actions.btnAddFuncionarios
                        },
                        excluir: {
                            html: "Excluir",
                            state: "delete",
                            click: actions.btnDelete
                        },
                        salvar: {
                            html: "Salvar",
                            state: "save",
                            preLoad: "Salvando",
                            click: actions.btnSave,
                            id: "btnSave",
                        },
                        cancelar: {
                            html: "Cancelar",
                            state: "cancel",
                            click: actions.btnCancel
                        },
                    }
                }
            }, enter: function () {
                document.getElementById('btnUpdate').click()
            }
        });
    },

    criarModal() {
        state.modalAddFuncionariosGrupo = new xModal.create({
            el: "#modalAddFuncionariosGrupo",
            title: "Adicionar Funcionários ao Grupo",
            height: 580,
            width: 524,
            theme: "xModal-blue",
            onOpen: () => { state.modalAddFuncionariosGrupoOpened = true },
            onClose: () => { state.modalAddFuncionariosGrupoOpened = false }
        });
    },

    init() {
        actions.criarGrid()
        actions.criarModal()

        state.gridGruposFuncionarios.queryOpen({ DESCRICAO: "" }, () => {
            state.gridGruposFuncionarios.focus();
        });
    },

    btnInsert() {
        state.gridGruposFuncionarios.disable();
        state.gridGruposFuncionarios.focusField();
        state.gridGruposFuncionarios.clearElementSideBySide();
    },

    btnUpdate() {
        if (state.gridGruposFuncionarios.dataSource() == false) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum registro selecionado, operação cancelada!"
            })
            return false;
        }
        state.gridGruposFuncionarios.disable();
        state.gridGruposFuncionarios.focusField();
    },

    btnAddFuncionarios() {
        if (state.gridGruposFuncionarios.dataSource() == false) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum registro selecionado, operação cancelada!"
            })
            return false;
        }

        state.modalAddFuncionariosGrupo.open();
    },

    async btnDelete() {
        if (state.gridGruposFuncionarios.dataSource() == false) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum registro selecionado, operação cancelada!"
            })
            return false;
        }

        if (await msgConfirm("Confirmação", "Confirma exclusão deste registro?")) {
            await actions.deleteGrupoImpressao();
            state.gridGruposFuncionarios.focus();
        }
    },

    async btnSave() {
        if (utils.validaOBR()) {
            return false
        }

        if (await state.gridGruposFuncionarios.getDuplicityAll()) {
            return false;
        }

        if (state.gridGruposFuncionarios.dataSource() == false) {
            actions.insertGrupoImpressao();
        } else {
            await actions.updateGrupoImpressao();
        }

        state.gridGruposFuncionarios.enable();
        state.gridGruposFuncionarios.focus();
    },

    btnCancel() {
        state.gridGruposFuncionarios.enable();
    },

    async getGruposImpressao({ offset, param }: iParamGetGruposImpressao) {
        try {
            state.loading = true;
            const data = await serviceGruposFuncionarios.getGruposImpressao({ offset, param });
            state.loading = false

            return data
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao exibir os grupos!"
            })
        }
    },

    async getDuplicityGrupoImpressao({ field, value }: iParamGetDuplicityGrupoImpressao) {
        try {
            const data = await serviceGruposFuncionarios.getDuplicityGrupoImpressao({ field, value });

            return data
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao verificar a duplicidade!"
            })
        }
    },

    async insertGrupoImpressao() {
        try {
            state.loading = true;

            let param: iParamInsertGrupoImpressao = {
                NOME: state.dbGrupo.NOME.toUpperCase()
            }

            const data = await serviceGruposFuncionarios.insertGrupoImpressao(param);

            state.gridGruposFuncionarios.insertLine({
                ...param,
                ID_GRUPO_IMPRESSAO: data.ID_GRUPO_IMPRESSAO
            })


            state.loading = false

            return data
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao inserir o grupo!"
            })
        }
    },

    async updateGrupoImpressao() {
        try {
            state.loading = true;

            let param: iParamUpdateGrupoImpressao = {
                ID_GRUPO_IMPRESSAO: state.dbGrupo.ID_GRUPO_IMPRESSAO,
                NOME: state.dbGrupo.NOME.toUpperCase()
            }

            const data = await serviceGruposFuncionarios.updateGrupoImpressao(param);

            state.gridGruposFuncionarios.dataSource({
                ...param
            })

            state.loading = false

            return data
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao alterar o grupo!"
            })
        }
    },

    async deleteGrupoImpressao() {
        try {
            state.loading = true

            let param: iParamDeleteGrupoImpressao = {
                ID_GRUPO_IMPRESSAO: state.dbGrupo.ID_GRUPO_IMPRESSAO
            }

            await serviceGruposFuncionarios.deleteGrupoImpressao(param);

            state.gridGruposFuncionarios.deleteLine();

            state.loading = false
        } catch (error) {
            state.loading = false
            Swal.fire({
                icon: "error",
                text: "Erro ao excluir o grupo!"
            })
        }
    }
}

export default { state, actions }