<script setup lang="ts">
import { onMounted, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import servicePis from "../services/configuracaoNfe.service";

const state = reactive({
  grid: {} as ixGridCreate,
  pisLista: [] as any[],
  pis: {} as any,
  loading: false,
  isEditing: false,
});

const actions = {
  async init() {
    await actions.gridPis();
  },

  gridPis() {
    state.grid = new xGridV2.create({
      el: "#gridPis",
      height: 325,
      count: true,
      columns: {
        Valor: { dataField: "P_VALOR", width: "50%" },
        "Código Regime Tributário": { dataField: "ID_REGIME_TRIBUTARIO", width: "50%" },
      },
      query: {
        async execute() {
          const data = await actions.getDadosParaInputs();
          state.grid.querySourceAdd(data);
        },
      },
      sideBySide: {
        el: "#pnPisCampos",
        vModel(r) {
          state.pis = r;
        },
        duplicity: {
          dataField: ["ID_REGIME_TRIBUTARIO"],
          async execute() {
            return false;
          },
        },
        frame: {
          el: "#pnRegimeBotoes",
          buttons: {
            novo: {
              html: "Novo",
              state: "insert",
              click: actions.btnInsert,
            },
            update: {
              html: "Alterar",
              state: "update",
              click: actions.btnEdit,
              id: "btnRegimeUpdate",
            },
            excluir: {
              html: "Excluir",
              state: "delete",
              click: actions.btnDelete,
            },
            salvar: {
              html: "Salvar",
              state: "save",
              click: actions.btnSave,
              preLoad: "Salvando",
            },
            cancela: {
              html: "Cancelar",
              state: "cancel",
              click: actions.btnCancel,
            },
          },
        },
        
      },
    });
    actions.getDadosParaInputs();
  },

  async getDadosParaInputs() {
    try {
      state.loading = true;
      const data = await servicePis.getDadosParaInputs();
      state.pisLista = data.pis;
    } catch {
      Swal.fire({ icon: "error", text: "Erro ao buscar os dados!" });
    } finally {
      state.loading = false;
    }
  },

  btnInsert() {
    state.isEditing = true;
    state.pis = {};
    state.grid.disable();
    state.grid.focusField();
  },

  btnEdit() {
    if (!state.grid.dataSource()) {
      Swal.fire({ icon: "info", text: "Nenhum registro selecionado." });
      return;
    }
    state.isEditing = true;
    state.grid.disable();
    state.grid.focusField();
  },

  async btnDelete() {
    if (!state.grid.dataSource()) {
      Swal.fire({ icon: "info", text: "Selecione um registro para excluir." });
      return;
    }
    if (await msgConfirm("Confirmação", "Excluir este registro?")) {
      try {
        state.loading = true;
        await servicePis.toDeletePis(state.grid.dataSource().ID_PIS);
        state.grid.deleteLine();
        Swal.fire({ icon: "success", text: "Registro excluído!" });
      } catch {
        Swal.fire({ icon: "error", text: "Erro ao excluir." });
      } finally {
        state.loading = false;
      }
    }
  },

  async btnSave() {
    if (utils.validaOBR()) return;
    if (await state.grid.getDuplicityAll()) return;
    try {
      state.loading = true;
      if (state.pis.ID_PIS) {
        await servicePis.toUpdatePis(state.pis);
        state.grid.dataSource({ ...state.pis });
        Swal.fire({ icon: "success", text: "Registro atualizado!" });
      } else {
        const response = await servicePis.toUpdatePis(state.pis);
        state.pis.ID_PIS = response.id;
        state.grid.insertLine({ ...state.pis });
        Swal.fire({ icon: "success", text: "Registro inserido!" });
      }
      state.grid.enable();
      state.grid.focus();
    } catch {
      Swal.fire({ icon: "error", text: "Erro ao salvar." });
    } finally {
      state.loading = false;
    }
  },

  btnCancel() {
    state.grid.enable();
    state.grid.focus();
  },
};

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card width="880" class="pa-5 ma-auto">
      <v-overlay :value="state.loading" absolute>
        <v-progress-circular indeterminate color="primary" size="50" />
      </v-overlay>
      <h2 class="text-center">PIS</h2>

      <v-form @submit.prevent="actions.btnSave" id="pnPisCampos">
        <v-row dense>
          <v-col cols="6">
            <v-text-field v-model="state.pis.P_VALOR" label="Valor" type="number" outlined dense />
          </