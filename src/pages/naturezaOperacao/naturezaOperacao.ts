import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";
import { iGetDuplicidadeParam, iGetNaturezaOperacaoGrid, iGetNaturezaOperacaoParam, iInsertNaturezaOperacaoParam, iNaturezaOperacao, iUpdateNaturezaOperacaoParam } from "./interfaces";
import Swal from "sweetalert2";
import serviceNaturezaOperacao from "./services/naturezaOperacao.service";

export const state = reactive({
    gridNaturezaOperacao: <ixGridCreate>{},
    dbNarurezaOperacao: <iNaturezaOperacao>{},
    loading: false
})

export const actions = {
    criarGrid() {
        state.gridNaturezaOperacao = new xGridV2.create({
            el: '#gridNaturezaOperacao',
            height: 300,
            count: true,
            columns: {
                'Descrição': { dataField: 'DESCRICAO' },
                'CFOP': { dataField: 'CFOP', center: true, width: '20%' },
            },
            query: {
                async execute(rs) {
                    let data = await serviceNaturezaOperacao.getNaturezaOperacao({
                        offset: rs.offset,
                        param: rs.param as iGetNaturezaOperacaoParam
                    });
                    state.gridNaturezaOperacao.querySourceAdd(data);
                }
            },
            sideBySide: {
                el: '#pnCampos',
                vModel(r) {
                    state.dbNarurezaOperacao = r;
                },
                duplicity: {
                    dataField: ['CFOP'],
                    async execute(rs) {
                        let dup = await actions.getDuplicidade({
                            value: rs.value.toUpperCase(),
                            field: rs.field
                        });
                        if (Object.keys(dup).length > 0) {
                            state.gridNaturezaOperacao.showMessageDuplicity(
                                rs.text + " já está cadastrada"
                            );
                            return true;
                        }

                        return false;
                    }
                },
                frame: {
                    el: '#pnBotoes',
                    buttons: {
                        novo: {
                            html: "Novo",
                            state: "insert",
                            click: () => { },
                            id: "btnInsert"
                        },
                        update: {
                            html: "Alterar",
                            state: "update",
                            click: () => { },
                            id: "btnUpdate",
                        },
                        excluir: {
                            html: "Excluir",
                            state: "delete",
                            click: () => { },
                        },
                        salvar: {
                            html: "Salvar",
                            state: "save",
                            click: () => { },
                            preLoad: "Salvando",
                        },
                        cancela: {
                            html: "Cancelar",
                            state: "cancel",
                            click: () => { },
                        },
                    },
                }
            },
            enter: function () {
                document.getElementById('btnUpdate').click()
            },
        })
    },

    init() {
        actions.criarGrid()
        state.gridNaturezaOperacao.queryOpen({
            SEARCH: ""
        }, () => {
            state.gridNaturezaOperacao.focus();
        }
        )
    },

    async getNaturezaOperacao({ param, offset }: iGetNaturezaOperacaoGrid) {
        try {
            state.loading = true
            const data = await serviceNaturezaOperacao.getNaturezaOperacao({ param, offset });

            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao buscar as naturezas de operações"
            })
        } finally {
            state.loading = false;
        }
    },

    async getDuplicidade({ field, value }: iGetDuplicidadeParam) {
        try {
            const data = await serviceNaturezaOperacao.getDuplicidade({ field, value });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao verificar duplicidade!"
            })
        }
    },

    async insertNaturezaOperacao() {
        try {
            state.loading = true;

            let param: iInsertNaturezaOperacaoParam = {
                CFOP: state.dbNarurezaOperacao.CFOP,
                DESCRICAO: state.dbNarurezaOperacao.DESCRICAO
            }

            const data = await serviceNaturezaOperacao.insertNaturezaOperacao(param);

            state.gridNaturezaOperacao.insertLine({
                ...state.gridNaturezaOperacao,
                ID_NATUREZA_OPERACAO: data[0].ID_NATUREZA_OPERACAO,
            })

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao inserir a natureza de operação"
            })
        } finally {
            state.loading = false;
        }
    },

    async updateNaturezaOperacao() {
        try {
            state.loading = true;

            let param: iUpdateNaturezaOperacaoParam = {
                ID_NATUREZA_OPERACAO: state.dbNarurezaOperacao.ID_NATUREZA_OPERACAO,
                CFOP: state.dbNarurezaOperacao.CFOP,
                DESCRICAO: state.dbNarurezaOperacao.DESCRICAO
            }

            await serviceNaturezaOperacao.updateNaturezaOperacao(param);

            state.gridNaturezaOperacao.dataSource({
                ...state.gridNaturezaOperacao,
            })

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao atualizar a natureza de operação"
            })
        } finally {
            state.loading = false;
        }
    },

    async deleteNaturezaOperacao() {
        try {
            state.loading = true;

            let id_natureza_operacao = state.dbNarurezaOperacao.ID_NATUREZA_OPERACAO

            await serviceNaturezaOperacao.deleteNaturezaOperacao(id_natureza_operacao);

            state.gridNaturezaOperacao.deleteLine();

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Ocorreu um erro ao excluir a natureza de operação"
            })
        } finally {
            state.loading = false;
        }
    }
}