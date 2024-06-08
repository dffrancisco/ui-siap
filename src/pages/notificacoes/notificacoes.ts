import { reactive, nextTick } from 'vue'
import { iNotificacao, iParamInsertNotificacao, iParamUpdateNotificacao, iQueryGetNotificacoes } from './intefaces'
import xGridV2, { ixGridCreate } from '@/plugins/xGridV2'
import Swal from "sweetalert2";
import serviceNotificacoes from "./services/notificacoes.service"
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import moment from 'moment';

export const state = reactive({
    gridNotificacoes: <ixGridCreate>{},
    dbNotificacao: <iNotificacao>{},
    checkboxNotificacoesInativadas: false,
    searchDisabled: false,
    inputSearch: <HTMLInputElement>{},
    loading: false,
})


export const actions = {
    criarGrid() {
        state.gridNotificacoes = new xGridV2.create({
            el: "#gridNotificacoes",
            height: 250,
            count: true,
            columns: {
                TITULO: { dataField: "titulo" },
                "DESCRIÇÃO": { dataField: "descricao" },
                "DATA/HORA": { dataField: "data_hora_criacao", compare: "dataHora", width: "20%", center: true }
            },
            compare: {
                dataHora: (r) => moment(r.data_hora_criacao).format("DD/MM/YYYY HH:mm")
            },
            query: {
                async execute(rs) {
                    let data = await actions.getNotificacoes({
                        offset: rs.offset,
                        param: rs.param,
                    });

                    state.gridNotificacoes.querySourceAdd(data)
                }
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) { state.dbNotificacao = { ...r } },
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
                        excluir: {
                            html: "Inativar",
                            state: "delete",
                            click: actions.btnInativarReativar,
                            id: "btnInativarReativar",
                        },
                        salvar: {
                            html: "Salvar",
                            state: "save",
                            preLoad: "Salvando",
                            click: actions.btnSave,
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
            },
        });
    },

    init() {
        actions.criarGrid()

        state.inputSearch = <any>document.getElementById("edtSearch")

        state.gridNotificacoes.queryOpen({ titulo: "", checkbox: state.checkboxNotificacoesInativadas }, () => {
            state.gridNotificacoes.focus();
        });
    },

    searchGrupos() {
        state.gridNotificacoes.queryOpen({ titulo: state.inputSearch.value.toUpperCase(), checkbox: state.checkboxNotificacoesInativadas }, () => { });
    },

    async btnInsert() {
        state.searchDisabled = true
        state.dbNotificacao = {} as iNotificacao
        await nextTick();

        state.gridNotificacoes.disable();
        state.gridNotificacoes.focusField();
    },

    async btnUpdate() {
        if (state.gridNotificacoes.dataSource() == false) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum registro selecionado, operação cancelada!"
            })
            return false;
        }

        state.searchDisabled = true;
        await nextTick()

        state.gridNotificacoes.disable();
        state.gridNotificacoes.focusField();
    },

    async btnInativarReativar() {
        if (state.gridNotificacoes.dataSource() == false) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum registro selecionado, operação cancelada!"
            })
            return false;
        }

        if (state.checkboxNotificacoesInativadas) {
            if (await msgConfirm("Confirmação", "Confirma a reativação deste registro?")) {
                await actions.reativarNotificacao();
                state.gridNotificacoes.focus();
            }
            return
        }

        if (await msgConfirm("Confirmação", "Confirma a inativação deste registro?")) {
            await actions.inativarNotificacao();
            state.gridNotificacoes.focus();
        }
    },

    async showNotificacoesInativas() {
        state.gridNotificacoes.queryOpen({
            titulo: '', checkbox: state.checkboxNotificacoesInativadas
        });

        if (state.checkboxNotificacoesInativadas) {
            $('#btnInativarReativar').text('Reativar')
        } else {
            $('#btnInativarReativar').text('Inativar')
        }
    },

    async btnSave() {
        if (utils.validaOBR()) {
            return false
        }

        if (state.gridNotificacoes.dataSource() == false) {
            actions.insertNotificacao();
        } else {
            await actions.updateGrupoImpressao();
        }


        state.searchDisabled = false;
        await nextTick();

        state.gridNotificacoes.enable();
        state.gridNotificacoes.focus();
    },

    async btnCancel() {
        state.searchDisabled = false
        let linhaGrid = <any>state.gridNotificacoes.getIndex()
        await nextTick();

        state.gridNotificacoes.enable();
        state.gridNotificacoes.focus(linhaGrid);
    },

    async getNotificacoes({ offset, param }: iQueryGetNotificacoes) {
        try {
            state.loading = true
            let data = await serviceNotificacoes.getNotificacoes({ offset, param })
            return data
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar as notificações"
            })
        } finally {
            state.loading = false
        }
    },

    async insertNotificacao() {
        try {
            state.loading = true

            let param: iParamInsertNotificacao = {
                titulo: state.dbNotificacao.titulo,
                descricao: state.dbNotificacao.descricao,
            }

            let data = await serviceNotificacoes.insertNotificacao(param)

            state.gridNotificacoes.insertLine({
                ...param,
                id_notificacao: data[0].id_notificacao,
                data_hora_criacao: moment(),
            })

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao inserir as notificações"
            })
        } finally {
            state.loading = false
        }
    },

    async updateGrupoImpressao() {
        try {
            state.loading = true

            let param: iParamUpdateNotificacao = {
                id_notificacao: state.dbNotificacao.id_notificacao,
                titulo: state.dbNotificacao.titulo,
                descricao: state.dbNotificacao.descricao,
            }

            await serviceNotificacoes.updateNotificacao(param)

            state.gridNotificacoes.dataSource({
                ...param,
            })

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao atualizar a notificação"
            })
        } finally {
            state.loading = false
        }
    },

    async inativarNotificacao() {
        try {
            state.loading = true
            await serviceNotificacoes.inativarNotificacao(state.dbNotificacao.id_notificacao)
            state.gridNotificacoes.deleteLine()
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao inativar a notificação"
            })
        } finally {
            state.loading = false
        }
    },

    async reativarNotificacao() {
        try {
            state.loading = true
            await serviceNotificacoes.reativarNotificacao(state.dbNotificacao.id_notificacao)
            state.gridNotificacoes.deleteLine()
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Erro ao reativar a notificação"
            })
        } finally {
            state.loading = false
        }
    }
}

export default { state, actions } 
