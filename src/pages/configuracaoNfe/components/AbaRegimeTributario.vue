<script setup lang="ts">
import { onMounted, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import serviceNfe from "../services/configuracaoNfe.service";
import { iFieldDuplicity, iRegimeTributario } from "../interfaces";

const state = reactive({
  grid: {} as ixGridCreate,
  regimeTributarioLista: [] as iRegimeTributario[],
  regimeTributario: {} as iRegimeTributario,
  loading: false,
  isEditing: false,
});

defineProps({
  regimeTributario: Object,
});

const actions = {
  async init() {
    await actions.gridRegimeTributario();
    await actions.getDadosParaInputs();
  },

  gridRegimeTributario() {
    state.grid = new xGridV2.create({
      el: "#gridRegimeTributario",
      height: 325,
      count: true,
      columns: {
        "Código Regime Tributário": {
          dataField: "ID_REGIME_TRIBUTARIO",
          width: "30%",
        },
        Descrição: {
          dataField: "DESCRICAO",
          width: "70%",
        },
      },
      query: {
        async execute() {
          const data = await actions.getDadosParaInputs();
        },
      },
      sideBySide: {
        el: "#pnRegimeCampos",
        vModel(r) {
          state.regimeTributario = r;
        },
        duplicity: {
          dataField: ["ID_REGIME_TRIBUTARIO"],
          async execute(rs) {
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
      enter: function () {
        document.getElementById("btnRegimeUpdate")?.click();
      },
    });
  },

  async getDadosParaInputs() {
    try {
      state.loading = true;

      const data = await serviceNfe.getDadosParaInputs();

      state.regimeTributario = data.regimeTributario[0];
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao buscar os dados iniciais!",
      });
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

    state.regimeTributario = {} as iRegimeTributario;
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
        await serviceNfe.toDeleteRegimeTributario(selected.ID_REGIME_TRIBUTARIO);
        state.grid.deleteLine();
        Swal.fire({
          icon: "success",
          text: "Registro excluído com sucesso!",
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          text: "Erro ao excluir registro.",
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
      if (state.regimeTributario.ID_REGIME_TRIBUTARIO) {
        await serviceNfe.toUpdateRegimeTributario(state.regimeTributario);
        state.grid.dataSource({ ...state.regimeTributario });
        Swal.fire({
          icon: "success",
          text: "Registro atualizado com sucesso!",
        });
      } else {
        const response = await serviceNfe.toInsertRegimeTributario(state.regimeTributario);

        state.regimeTributario.ID_REGIME_TRIBUTARIO = response.ID_REGIME_TRIBUTARIO;
        state.grid.insertLine({ ...state.regimeTributario });
        Swal.fire({
          icon: "success",
          text: "Registro inserido com sucesso!",
        });
      }
      state.grid.enable();
      state.grid.focus();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        text: "Erro ao salvar registro.",
      });
    } finally {
      state.loading = false;
    }
  },

  btnCancel() {
    state.grid.enable();
    state.grid.focus();
    state.regimeTributario = {} as iRegimeTributario;
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
        :value="state.loading"
        absolute
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="50"
        />
      </v-overlay>
      <h2 class="text-center mb-4">Regime Tributário</h2>

      <v-form
        @submit.prevent="actions.btnSave"
        id="pnRegimeCampos"
      >
        <v-row dense>
          <v-col cols="3">
            <v-text-field
              v-model="state.regimeTributario.ID_REGIME_TRIBUTARIO"
              label="Código Tributário"
              type="number"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="state.regimeTributario.DESCRICAO"
              label="Descrição"
            />
          </v-col>
        </v-row>
      </v-form>

      <v-divider class="my-4"></v-divider>

      <div id="gridRegimeTributario"></div>
      <div
        id="pnRegimeBotoes"
        class="mt-2"
        style="text-align: center"
      ></div>
    </v-card>
  </v-container>
</template>
