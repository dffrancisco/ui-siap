import { reactive, nextTick } from "vue";
import { useEventListener } from "@vueuse/core";
import Swal from "sweetalert2";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import serviceFornecedores from "./services/fornecedores.service";
import {
    iFornecedores,
    iParamGetFornecedor,
    iGetDuplicityResponse,
    iInsertResponse,
    iParamToUpdate
} from "./interfaces";

// Estado reativo para armazenar o estado do componente
export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    lista: <iFornecedores[]>[],
    edtSearch: "",
    dbFornecedor: <iFornecedores>{},
    loading: false,
});

// Listener para atalhos de teclado
export const eventListener = (event: KeyboardEvent) => {
    if (event.key === "F1") {
        document.getElementById("edtSearch")?.focus();
        event.preventDefault();
        event.stopPropagation();
    }
};

// Ações disponíveis no componente
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
            height: 300,
            count: true,
            columns: {
                CNPJ: { dataField: "CNPJ" },
                "Razão Social": { dataField: "RAZAO_SOCIAL" },
                Cidade: { dataField: "CIDADE" },
            },
            query: {
                async execute(rs) {
                    const data = await actions.getFornecedores({
                        offset: rs.offset,
                        param: rs.param,
                    });
                    state.gridPrincipal.querySourceAdd(data);
                },
            },
            sideBySide: {
                el: "#pnCampos",
                vModel(r) {
                    state.dbFornecedor = r as iFornecedores;
                },
                duplicity: {
                    dataField: ["CNPJ"],
                    async execute(rs) {
                        const dup = await actions.getDuplicidade({
                            value: rs.value,
                            field: rs.field,
                        });
                        if (dup) {
                            state.gridPrincipal.showMessageDuplicity(`${rs.text} já cadastrado!`);
                            return true;
                        }
                        return false;
                    },
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
            const fornecedores = await serviceFornecedores.getFornecedores({ offset, param });
            return fornecedores;
        } catch (error) {
            Swal.fire("Erro", "Erro ao carregar fornecedores.", "error");
            throw error;
        } finally {
            state.loading = false;
        }
    },

    async getDuplicidade({ value, field }: iGetDuplicityResponse) {
        try {
            return await serviceFornecedores.getDuplicidade({ value, field });
        } catch (error) {
            Swal.fire("Erro", "Erro ao verificar duplicidade.", "error");
            throw error;
        }
    },

    async search() {
        const searchValue = state.edtSearch?.toUpperCase();

        state.gridPrincipal.queryOpen({
            razaoSocial: searchValue,
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
            Swal.fire("Atenção", "Nenhum registro selecionado.", "info");
            return false;
        }
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnDelete() {
        const selectedFornecedor = state.gridPrincipal.dataSource() as iFornecedores;
        if (!selectedFornecedor) {
            Swal.fire("Atenção", "Selecione um registro.", "info");
            return false;
        }
        if (await msgConfirm("Confirmação", "Confirma a exclusão?")) {
            await actions.deleteFornecedor(selectedFornecedor.idFornecedor);
        }
    },

    async deleteFornecedor(idFornecedor: number) {
        try {
            state.loading = true;
            await serviceFornecedores.toDelete(idFornecedor);
            state.gridPrincipal.deleteLine();
            Swal.fire("Sucesso", "Fornecedor excluído com sucesso.", "success");
        } catch (error) {
            Swal.fire("Erro", "Erro ao excluir fornecedor.", "error");
            throw error;
        } finally {
            state.loading = false;
        }
    },

    async btnSave() {
        if (utils.validaOBR()) return;

        const isDuplicate = state.gridPrincipal.getDuplicityAll();
        if (isDuplicate) return;

        const isNew = !state.gridPrincipal.dataSource();
        if (isNew) {
            await actions.createFornecedor();
        } else {
            await actions.updateFornecedor();
        }

        state.pnSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus();
    },

    async createFornecedor() {
        try {
            state.loading = true;
            const fornecedor = await serviceFornecedores.toInsert(state.dbFornecedor);
            state.gridPrincipal.insertLine({ ...state.dbFornecedor, idFornecedor: fornecedor.id });
            Swal.fire("Sucesso", "Fornecedor criado com sucesso.", "success");
        } catch (error) {
            Swal.fire("Erro", "Erro ao criar fornecedor.", "error");
            throw error;
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

            Swal.fire("Sucesso", "Fornecedor atualizado com sucesso.", "success");
        } catch (error) {
            Swal.fire("Erro", "Erro ao atualizar fornecedor.", "error");
            throw error;
        } finally {
            state.loading = false;
        }
    },

    async btnCancel() {
        state.pnSearch = false;
        state.gridPrincipal.enable();
    },
};
