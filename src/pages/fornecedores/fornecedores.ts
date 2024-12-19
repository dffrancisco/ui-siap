import { reactive, nextTick } from "vue";
import { useEventListener } from "@vueuse/core";
import Swal from "sweetalert2";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import serviceFornecedores from './services/fornecedores.service';
import {
    iFornecedor,
    iParamGetFornecedor,
    iRepresentantes,
    iCidades,
    iGetFornecedoresResponse
} from "./interfaces";

const openModal = () => {
    state.modalFornecedorOpened = true;
};

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    edtSearch: "",
    lista: <iFornecedor[]>[],
    dbFornecedor: <iFornecedor>{},
    dbRepresentante: <iRepresentantes>{},
    loading: false,
    modalFornecedorOpened: false,
    selectedFornecedor: <iFornecedor | null>null,
    checkboxAtiva: false,
    isChecked: false,
    listaCidades: <iCidades[]>[],
    toggleDisabled: false,
    cnpjDisabled: false,
});

export const eventListener = (event: KeyboardEvent) => {
    if (event.key === "F1") {
        document.getElementById("edtSearch")?.focus();
        event.preventDefault();
        event.stopPropagation();
    }
};

export const actions = {
    async init() {
        actions.grids();
        await actions.getCidades();
        state.gridPrincipal.queryOpen({}, () => {
            state.gridPrincipal.focus();
        });
    },

    grids() {
        state.gridPrincipal = new xGridV2.create({
            el: "#gridPrincipal",
            height: 200,
            count: true,
            columns: {
                CNPJ: { dataField: "CGC_FORNECEDOR" },
                "Razão Social": { dataField: "RAZAO_SOCIAL" },
                Cidade: { dataField: "CIDADE", center: true },
            },
            query: {
                async execute(rs) {
                    const data = await actions.getFornecedores({
                        offset: rs.offset,
                        param: {
                            ...rs.param,
                            checkboxAtiva: state.isChecked,
                        },
                    });
                    state.gridPrincipal.querySourceAdd(data);
                },
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbFornecedor = r as iFornecedor;
                },
                frame: {
                    el: "#pnBotoes",
                    buttons: {
                        novo: { html: "Novo", state: "insert", click: actions.btnInsert },
                        alterar: { html: "Alterar", state: "update", click: actions.btnEdit },
                        excluir: { html: "Inativar", state: "delete", click: actions.btnDelete },
                        salvar: { html: "Salvar", state: "save", click: actions.btnSave },
                        cancelar: { html: "Cancelar", state: "cancel", click: actions.btnCancel },
                    },
                },
            },
        });
    },

    async getFornecedores({ offset, param }: iParamGetFornecedor) {
        try {
            state.loading = true;

            const fornecedores = await serviceFornecedores.getFornecedores({
                offset,
                param,
                checkboxAtiva: state.checkboxAtiva,
            });
            return fornecedores;
        } catch (error) {
            await Swal.fire({
                text: "Erro ao carregar fornecedores.",
                icon: "error",
            });
            throw error;
        } finally {
            state.loading = false;
        }
    },

    async getCidades() {
        try {
            const data = await serviceFornecedores.getCidades();
            state.listaCidades = data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao exibir as cidades'
            })
        }
    },

    async search() {
        const searchValue = state.edtSearch?.toUpperCase();
        state.gridPrincipal.queryOpen({
            RAZAO_SOCIAL: searchValue,
            checkboxAtiva: state.checkboxAtiva,
        });
    },

    async btnInsert() {
        state.pnSearch = true;
        state.toggleDisabled = true
        state.dbFornecedor = {} as iFornecedor;

        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
        state.gridPrincipal.clearElementSideBySide();
    },

    btnEdit() {

        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                text: "Nenhum registro selecionado.",
                icon: "info",
            });
            return false;
        }

        state.pnSearch = true
        state.toggleDisabled = true
        state.cnpjDisabled = true
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnDelete() {


        if (state.gridPrincipal.dataSource() === false) {
            Swal.fire({
                icon: 'info',
                text: 'Nenhum registro selecionado para alteração, operação cancelada!'
            })
            return false;
        }
        if (!state.isChecked) {
            if (await msgConfirm("Confirmação", "Confirma a inativação deste registro?")) {
                await actions.toInativar()
                state.gridPrincipal.focus();
            }
        } else {
            if (await msgConfirm("Confirmação", "Confirma a reativação deste registro?")) {
                await actions.toInativar()
                state.gridPrincipal.focus();
            }

        }
        state.gridPrincipal.clearElementSideBySide();
    },

    async btnSave() {
        if (utils.validaOBR()) return;

        const isNew = !state.gridPrincipal.dataSource();
        if (isNew) {
            await actions.insertFornecedor();
        } else {
            await actions.updateFornecedor();
        }

        state.pnSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async btnCancel() {
        state.pnSearch = false;
        state.gridPrincipal.enable();
    },

    async toInativar() {
        try {
            let ID_FORNECEDOR = state.dbFornecedor.ID_FORNECEDOR
            let DELETADO = state.dbFornecedor.DELETADO

            state.loading = true
            await serviceFornecedores.toInativar(ID_FORNECEDOR, DELETADO);
            state.loading = false

            state.gridPrincipal.deleteLine();
        } catch (error) {
            state.loading = false;
            Swal.fire({
                icon: 'error',
                text: 'Erro ao inativar fornecedor'
            })
        }
    },

    async insertFornecedor() {
        try {
            let newFields = <any>(
                state.gridPrincipal.getElementSideBySideJson(true, false)
            );

            console.log("Dados enviados para inserção:", newFields);

            state.loading = true;
            let data = await serviceFornecedores.toInsert(newFields);
            state.loading = false;

            let cidade = null;

            if (newFields.COD_CIDADE) {
                cidade = actions.encontrarCidades(newFields.COD_CIDADE);
            }

            state.gridPrincipal.insertLine({
                ...newFields,
                CIDADE: cidade,
                ID_FORNECEDOR: data.ID_FORNECEDOR,
            });
        } catch (error) {
            state.loading = false;
            console.error("Erro durante inserção:", error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao inserir fornecedor',
            });
        }
    },


    encontrarCidades(COD_CIDADE: number) {
        const cidadeEncontrada = state.listaCidades.find(cidade => {
            if ((cidade.COD_CIDADE == COD_CIDADE)) {
                return true;
            }

            return false;
        })

        if (cidadeEncontrada) {
            let cidade = cidadeEncontrada.DESCRICAO
            return cidade
        } else {
            let cidade = null
            return cidade
        }
    },

    encontrarCodCidade(COD_IBGE: string) {
        const cidadeEncontrada = state.listaCidades.find(cidade => {
            if ((cidade.COD_IBGE == COD_IBGE)) {
                return true;
            }

            return false;

        })

        if (cidadeEncontrada) {
            let cidade = cidadeEncontrada.COD_CIDADE
            return cidade
        } else {
            let cidade = null
            return cidade
        }


    },

    encontrarCodCidade2(DESCRICAO: string) {
        const cidadeEncontrada = state.listaCidades.find(cidade => {
            if ((cidade.DESCRICAO == DESCRICAO)) {
                return true;
            }

            return false;

        })

        if (cidadeEncontrada) {
            let cidade = cidadeEncontrada.COD_CIDADE
            return cidade
        } else {
            let cidade = null
            return cidade
        }


    },

    async updateFornecedor() {
        try {
            const diff = state.gridPrincipal.getDiffTwoJson(false);
            if (!diff.diff) return;

            const updatedFornecedor: iFornecedor = { ...state.dbFornecedor, ...diff.new };
            state.loading = true;

            await serviceFornecedores.toUpdate(updatedFornecedor);

            state.gridPrincipal.dataSource(updatedFornecedor);

            Swal.fire({
                text: "Fornecedor atualizado com sucesso.",
                icon: "success",
            });
        } catch (error) {
            Swal.fire({
                text: "Erro ao atualizar fornecedor.",
                icon: "error",
            });
            throw error;
        } finally {
            state.loading = false;
        }
    },

    closeModal() {
        state.modalFornecedorOpened = false;
    },

    async saveFornecedorModal() {
        try {
            if (!state.selectedFornecedor) {
                Swal.fire({
                    text: "Nenhum fornecedor selecionado.",
                    icon: "error",
                });
                return;
            }

            if (state.selectedFornecedor.ID_FORNECEDOR) {
                await actions.updateFornecedor();
            } else {
                await actions.insertFornecedor();
            }

            actions.closeModal();
        } catch (error) {
            Swal.fire({
                text: "Erro ao salvar fornecedor.",
                icon: "error",
            });
            console.error(error);
        }
    },

    async selecionarRepresentante(representante: iRepresentantes) {
        if (!representante) {
            Swal.fire({
                text: "Nenhum representante selecionado.",
                icon: "error",
            });
            return;
        }

        state.dbFornecedor.NOME = representante.NOME;

        actions.closeModal();
    },
};
