import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { reactive } from "vue";
import { iNaturezaOperacao } from "./interfaces";

export const state = reactive({
    gridNaturezaOperacao: <ixGridCreate>{},
    dbNarurezaOperacao: <iNaturezaOperacao>{},
})

export const actions = {
    criarGrid() {
        state.gridNaturezaOperacao = new xGridV2.create({
            el: '#gridNaturezaOperacao',
            height: 300,
            count: true,
            columns: {
                'Descrição': { dataField: 'DESCRICAO' },
                'CFOP': { dataField: 'CFOP', center: true },
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
    }
}