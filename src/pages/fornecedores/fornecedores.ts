import { reactive, nextTick } from "vue";
import { useEventListener } from "@vueuse/core";
import Swal from "sweetalert2";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import serviceFornecedores from './services/fornecedores.service';
import {
    iFornecedores,
    iParamGetFornecedor,
    iInsertResponse,
    iParamToUpdate,
    iParamGetRepresentante,
} from "./interfaces";

const openModal = () => {
    state.modalFornecedorOpened = true;
};

export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    edtSearch: "",
    lista: <iFornecedores[]>[],
    dbFornecedor: <iFornecedores>{},
    dbRepresentante: <iParamGetRepresentante>{},
    loading: false,
    modalFornecedorOpened: false,
    selectedFornecedor: <iFornecedores | null>null,
    checkboxAtiva: false,
    isChecked: false,

    descricoes: [],
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
                    state.dbFornecedor = r as iFornecedores;
                },
                frame: {
                    el: "#pnBotoes",
                    buttons: {
                        novo: { html: "Novo", state: "insert", click: actions.btnInsert },
                        alterar: { html: "Alterar", state: "update", click: actions.btnEdit },
                        excluir: { html: "Excluir", state: "delete", click: actions.btnDelete },
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

    async selecionarRepresentante(representante: iParamGetRepresentante) {
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

    async getDadosParaInputs() {
        try {
            state.loading = true;
            const dadosParaInputs = await serviceFornecedores.getDadosParaInputs();
            state.descricoes = dadosParaInputs.descricoes;
            return dadosParaInputs;
        } catch (error) {
            await Swal.fire({
                text: "Erro ao carregar dados para inputs.",
                icon: "error",
            });
            throw error;
        } finally {
            state.loading = false;
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
        state.dbFornecedor = {} as iFornecedores;
        await nextTick();
        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
    },

    btnEdit() {
        const selectedFornecedor = state.gridPrincipal.dataSource() as iFornecedores;
        if (!selectedFornecedor) {
            Swal.fire({
                text: "Nenhum registro selecionado.",
                icon: "info",
            });
            return false;
        }
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnDelete() {
        const selectedFornecedor = state.gridPrincipal.dataSource() as iFornecedores;
        if (!selectedFornecedor) {
            Swal.fire({
                text: "Selecione um registro.",
                icon: "info",
            });
            return false;
        }
        if (await msgConfirm("Confirmação", "Confirma a exclusão?")) {
            await actions.deleteFornecedor(selectedFornecedor.idFornecedor);
        }
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

    async deleteFornecedor(idFornecedor: number) {
        try {
            state.loading = true;
            await serviceFornecedores.toDelete(idFornecedor);
            state.gridPrincipal.deleteLine();
            Swal.fire({
                text: "Fornecedor excluído com sucesso.",
                icon: "success",
            });
        } catch (error) {
            Swal.fire({
                text: "Erro ao excluir fornecedor.",
                icon: "error",
            });
            throw error;
        } finally {
            state.loading = false;
        }
    },

    async insertFornecedor() {
        try {
            state.loading = true;

            const fornecedor: iInsertResponse = await serviceFornecedores.toInsert(state.dbFornecedor);

            const fornecedorParaInserir = {
                ...state.dbFornecedor,
                id: fornecedor.id,
            };

            state.gridPrincipal.insertLine(fornecedorParaInserir);

            Swal.fire({
                text: "Fornecedor criado com sucesso.",
                icon: "success",
            });
        } catch (warning) {
            await Swal.fire({
                text: "Preencha todos os campos para adicionar um novo fornecedor.",
                icon: "warning",
            });
        } finally {
            state.loading = false;
        }
    },

    async updateFornecedor() {
        try {
            const diff = state.gridPrincipal.getDiffTwoJson(false);
            if (!diff.diff) return;

            const updatedFornecedor: iParamToUpdate = { ...state.dbFornecedor, ...diff.new };
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

            if (state.selectedFornecedor.idFornecedor) {
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
};