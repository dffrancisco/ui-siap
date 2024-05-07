import { computed, nextTick, reactive } from "vue";
import {
    iFuncionarioGrupo,
    iFuncionarioGrupoOrdenado,
    iGrupo,
    iListaFuncionario,
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


export const funcionariosGrupoOrdenados = computed(() => {
    let funcionariosGrupo: iFuncionarioGrupoOrdenado[] = [];

    if (state.dbGrupo?.FUNCIONARIOS) {
        state.dbGrupo.FUNCIONARIOS.forEach((grupo) => {
            const funcionario = state.listaFuncionarios.find(
                (funcionario) => funcionario.COD_FUNCIONARIO == grupo.COD_FUNCIONARIO
            );

            if (funcionario) {
                funcionariosGrupo.push(funcionario);
            }
        });
    }

    funcionariosGrupo.sort((a, b) => {
        return a.LOGIN.localeCompare(b.LOGIN);
    });

    return funcionariosGrupo;
});


export const state = reactive({
    gridGruposFuncionarios: <ixGridCreate>{},

    modalAddFuncionariosGrupo: <iModalCreate>{},
    modalAddFuncionariosGrupoOpened: false,

    dbGrupo: <iGrupo>{},
    listaFuncionarios: <iListaFuncionario[]>[],

    searchDisabled: false,

    inputSearch: <HTMLInputElement>{},

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
                        addFuncionario: {
                            html: "Add. Funcionários",
                            state: "select",
                            click: actions.btnAddFuncionarios
                        },
                    }
                }
            }, enter: function () {
                document.getElementById('btnUpdate').click()
            },
            dblClick: actions.btnAddFuncionarios
        });
    },

    criarModal() {
        state.modalAddFuncionariosGrupo = new xModal.create({
            el: "#modalAddFuncionariosGrupo",
            title: "Adicionar Funcionários ao Grupo",
            height: 580,
            width: 568,
            theme: "xModal-blue",
            closeBtn: false,
            esc: false,
            onOpen: () => { state.modalAddFuncionariosGrupoOpened = true },
            onClose: () => { state.modalAddFuncionariosGrupoOpened = false }
        });
    },

    init() {
        actions.criarGrid()
        actions.criarModal()
        actions.getFuncionarios()

        state.inputSearch = <any>document.getElementById("edtSearch")

        state.gridGruposFuncionarios.queryOpen({ DESCRICAO: "" }, () => {
            state.gridGruposFuncionarios.focus();
        });
    },

    searchGrupos() {
        state.gridGruposFuncionarios.queryOpen({ DESCRICAO: state.inputSearch.value.toUpperCase() }, () => { });
    },

    getUrlFotoFuncionario(cpf: string) {
        let cpfSanitizado = cpf.replaceAll(".", "").replaceAll("-", "");
        return `https://www.reallatas.com.br/_serverAPP/thumb.php?img=https://www.reallatas.com.br/foto_funcionarios/${cpfSanitizado}.jpg`;
    },

    async btnInsert() {
        state.searchDisabled = true
        state.dbGrupo = {} as iGrupo
        await nextTick();

        state.gridGruposFuncionarios.disable();
        state.gridGruposFuncionarios.focusField();
    },

    async btnUpdate() {
        if (state.gridGruposFuncionarios.dataSource() == false) {
            Swal.fire({
                icon: "warning",
                text: "Nenhum registro selecionado, operação cancelada!"
            })
            return false;
        }

        state.searchDisabled = true;
        await nextTick()

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


        state.searchDisabled = false;
        await nextTick();

        state.gridGruposFuncionarios.enable();
        state.gridGruposFuncionarios.focus();
    },

    async btnCancel() {
        state.searchDisabled = false
        let linhaGrid = <any>state.gridGruposFuncionarios.getIndex()
        await nextTick();

        state.gridGruposFuncionarios.enable();
        state.gridGruposFuncionarios.focus(linhaGrid);
    },

    closeModalAddFuncionariosGrupo(funcionarios: iFuncionarioGrupo) {

        state.gridGruposFuncionarios.dataSource({
            FUNCIONARIOS: funcionarios
        })

        state.gridGruposFuncionarios.focus()

        state.modalAddFuncionariosGrupo.close();
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
                ID_GRUPO_IMPRESSAO: data.ID_GRUPO_IMPRESSAO,
                FUNCIONARIOS: []
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
    },

    async getFuncionarios() {
        try {
            state.loading = true;
            const data = await serviceGruposFuncionarios.getFuncionarios();
            state.listaFuncionarios = data;
            state.loading = false;
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: "error",
                text: "Erro ao buscar os funcionários!",
            });
        }
    },
}

export default { state, actions }