import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";
import { iGetNaturezaOperacaoGrid, iGetNaturezaOperacaoParam, iNaturezaOperacao } from "./interfaces";
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
        })
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
    }
}