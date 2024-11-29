import { reactive, nextTick } from "vue";
import { useEventListener } from "@vueuse/core";
import Swal from "sweetalert2";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import serviceFornecedores from "./services/fornecedores.service";
import { iFornecedores, iParamToInsertFornecedor, iParamGetFornecedor, iFieldDuplicity } from "./interfaces";



export const state = reactive({
    gridPrincipal: <ixGridCreate>{},
    pnSearch: false,
    lista: <iFornecedores[]>[],
    edtSearch: "",
    dbFornecedor: <iFornecedores>{},
    loading: false,
    ufs: ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"],
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
                    state.dbFornecedor = r;
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

    async getFornecedores({ offset, param }: { offset: number; param: Record<string, any> }) {
        try {
            state.loading = true;
            return await serviceFornecedores.getFornecedores({ offset, param });
        } catch (error) {
            Swal.fire("Erro", "Erro ao carregar fornecedores.", "error");
        } finally {
            state.loading = false;
        }
    },

    async getDuplicidade({ value, field }: iFieldDuplicity) {
        try {
            return value ? await serviceFornecedores.getDuplicidade({ value, field }) : null;
        } catch (error) {
            Swal.fire("Erro", "Erro ao verificar duplicidade.", "error");
        }
    },

    async btnInsert() {
        state.pnSearch = true;
        state.dbFornecedor = {} as iFornecedores;
        await nextTick();
        state.gridPrincipal.focusField();
        state.gridPrincipal.disable();
    },

    btnEdit() {
        if (!state.gridPrincipal.dataSource()) {
            Swal.fire("Atenção", "Nenhum registro selecionado.", "info");
            return false;
        }
        state.gridPrincipal.disable();
        state.gridPrincipal.focusField();
    },

    async btnDelete() {
        if (!state.gridPrincipal.dataSource()) {
            Swal.fire("Atenção", "Selecione um registro.", "info");
            return false;
        }
        if (await msgConfirm("Confirmação", "Confirma a exclusão?")) {
            await actions.deleteFornecedor();
        }
    },

    async deleteFornecedor() {
        try {
            state.loading = true;
            await serviceFornecedores.deleteFornecedor(state.dbFornecedor.idFornecedor);
            state.gridPrincipal.deleteLine();
            Swal.fire("Sucesso", "Fornecedor excluído com sucesso.", "success");
        } catch (error) {
            Swal.fire("Erro", "Erro ao excluir fornecedor.", "error");
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
            const fornecedor = await serviceFornecedores.createFornecedor(state.dbFornecedor);
            state.gridPrincipal.insertLine({ ...state.dbFornecedor, idFornecedor: fornecedor.id });
            Swal.fire("Sucesso", "Fornecedor criado com sucesso.", "success");
        } catch (error) {
            Swal.fire("Erro", "Erro ao criar fornecedor.", "error");
        } finally {
            state.loading = false;
        }
    },

    async updateFornecedor() {
        try {
            const diff = state.gridPrincipal.getDiffTwoJson(false);
            if (!diff.diff) return;

            const updatedFornecedor = { ...state.dbFornecedor, ...diff.new };
            state.loading = true;

            await serviceFornecedores.updateFornecedor(updatedFornecedor);
            state.gridPrincipal.dataSource(updatedFornecedor);

            Swal.fire("Sucesso", "Fornecedor atualizado com sucesso.", "success");
        } catch (error) {
            Swal.fire("Erro", "Erro ao atualizar fornecedor.", "error");
        } finally {
            state.loading = false;
        }
    },

    async btnCancel() {
        state.pnSearch = false;
        state.gridPrincipal.enable();
        state.gridPrincipal.focus(state.gridPrincipal.getIndex());
    },
};
