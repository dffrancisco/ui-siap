<script setup lang="ts">
import { onMounted, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import { iPis, iRegimeTributario, iFieldDuplicity } from "../interfaces";
import serviceNfe from "../services/configuracaoNfe.service";
import { data } from "jquery";

const state = reactive({
  grid: {} as ixGridCreate,
  pisLista: [] as iPis[],
  regimeTributarioLista: [] as iRegimeTributario[],
  pis: {} as iPis,
  loading: false,
  isEditing: false,
});

const actions = {
  async init() {
    await actions.getDadosParaInputs();
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
          await actions.getDadosParaInputs();
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
          async execute(rs) {
            let dup = await actions.getDuplicidade({
              value: rs.value.toUpperCase(),
              field: rs.field,
            });
            if (dup && Object.keys(dup).length > 0) {
              state.grid.showMessageDuplicity(rs.text + " já cadastrado.");
              return true;
            }
            return false;
          },
        },
        frame: {
          el: "#pnPisBotoes",
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
            },
            cancela: {
              html: "Cancelar",
              state: "cancel",
              click: actions.btnCancel,
            },
          },
        },
      },
      enter: function () {
        document.getElementById("btnPisUpdate")?.click();
      },
    });
  },

  async getDadosParaInputs() {
    try {
      state.loading = true;

      const data = await serviceNfe.getDadosParaInputs();

      state.pis = data.pis[0];
      return data.cofins;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao buscar os dados iniciais!",
      });
      return [];
    } finally {
      state.loading = false;
    }
  },

  async getDuplicidade({ value, field }: iFieldDuplicity) {
    try {
      const data = await serviceNfe.getDuplicidade({ value, field });
      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao verificar duplicidade.",
        text: error.message,
      });
    }
  },

  btnInsert() {
    state.isEditing = true;
    state.pis = {} as iPis;
    state.grid.disable();
    state.grid.focusField();
  },

  btnEdit() {
    if (!state.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Nenhum registro selecionado para alteração.",
      });
      return;
    }
    state.isEditing = true;
    state.grid.disable();
    state.grid.focusField();
  },

  async btnDelete() {
    const selected = state.grid.dataSource();
    if (!selected) {
      Swal.fire({
        icon: "info",
        text: "Selecione um registro para excluir.",
      });
      return;
    }
    if (await msgConfirm("Confirmação", "Confirma a exclusão deste registro?")) {
      try {
        state.loading = true;
        await serviceNfe.toDeletePis(selected.ID_PIS);
        state.grid.deleteLine();
        Swal.fire({
          icon: "success",
          text: "PIS excluído com sucesso!",
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          text: error.response?.data?.msg || "Erro ao excluir registro.",
        });
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
        await serviceNfe.toUpdatePis(state.pis);
        state.grid.dataSource({ ...state.pis });
        Swal.fire({
          icon: "success",
          text: "PIS atualizado com sucesso!",
        });
      } else {
        const response = await serviceNfe.toInsertPis(state.pis);
        state.pis.ID_PIS = response.ID_PIS;
        state.grid.insertLine({ ...state.pis });
        Swal.fire({
          icon: "success",
          text: "PIS cadastrado com sucesso!",
        });
      }
      state.grid.enable();
      state.grid.focus();
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.msg || "Erro ao salvar registro.",
      });
    } finally {
      state.loading = false;
    }
  },

  btnCancel() {
    state.grid.enable();
    state.grid.focus();
    state.pis = {} as iPis;
  },
};

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      width="880"
      class="pa-5 ma-auto"
    >
      <v-overlay
        :model-value="state.loading"
        absolute
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="50"
        />
      </v-overlay>

      <h2 class="text-center mb-4">Configuração de PIS</h2>

      <v-form
        @submit.prevent="actions.btnSave"
        id="pnPisCampos"
      >
        <v-row dense>
          <v-col cols="4">
            <v-select
              v-model="state.pis.ID_REGIME_TRIBUTARIO"
              :items="state.regimeTributarioLista"
              item-title="DESCRICAO"
              item-value="ID_REGIME_TRIBUTARIO"
              label="Regime Tributário"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="state.pis.P_VALOR"
              label="Valor do PIS"
              type="number"
              suffix="%"
            />
          </v-col>
        </v-row>
        <v-row
          justify="center"
          class="mt-4"
        >
        </v-row>
      </v-form>

      <div
        id="gridPis"
        class="mb-4"
      />
      <div
        id="pnPisBotoes"
        style="text-align: center"
      />
    </v-card>
  </v-container>
</template>

<style scoped>
.v-card {
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
}
.v-select,
.v-text-field {
  margin-bottom: 12px;
}
</style>
