import { reactive } from "vue";
import { iGrupo, iParamGetDuplicityGrupoImpressao, iParamGetGruposImpressao } from "./interfaces";
import Swal from "sweetalert2";
import serviceGruposFuncionarios from './services/gruposFuncionarios.service'
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2';

export const state = reactive({
    gridGruposFuncionarios: <ixGridCreate>{},

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
                    let data = await serviceGruposFuncionarios.getGruposImpressao({
                        offset: rs.offset,
                        param: rs.param
                    });
                    state.gridGruposFuncionarios.querySourceAdd(data)
                }
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) { state.dbGrupo = r },
                duplicity: {
                    dataField: ["NOME"],
                    async execute(rs) {
                        let dup = await serviceGruposFuncionarios.getDuplicityGrupoImpressao({
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
                            click: () => { }
                        },
                        update: {
                            html: "Alterar",
                            state: "update",
                            click: () => { }
                        },
                        addFuncionario: {
                            html: "Adicionar Funcionário",
                            state: "select",
                            click: () => { }
                        },
                        excluir: {
                            html: "Excluir",
                            state: "delete",
                            click: () => { }
                        },
                        salvar: {
                            html: "Salvar",
                            state: "save",
                            preLoad: "Salvando",
                            click: () => { }
                        },
                        cancelar: {
                            html: "Cancelar",
                            state: "cancel",
                            click: () => { }
                        },
                    }
                }
            },
        });
    },

    init() {
        actions.criarGrid()

        state.gridGruposFuncionarios.queryOpen({ DESCRICAO: "" }, () => {
            state.gridGruposFuncionarios.focus();
        });
    },

    async getGruposImpressao({ offset, param }: iParamGetGruposImpressao) {
        try {
            state.loading = true;
            let data = await serviceGruposFuncionarios.getGruposImpressao({ offset, param });
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
    }
}

export default { state, actions }