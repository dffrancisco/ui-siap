<script setup lang="ts">
import { onMounted, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import {} from "../configuracaoNfe";
import serviceNfe from "../services/configuracaoNfe.service";
import { iCofins, iFieldDuplicity } from "../interfaces";
import { watch } from "vue";

const state = reactive({
  grid: {} as ixGridCreate,
  confinsLista: [] as iCofins[],
  confins: {} as iCofins,
  loading: false,
  isEditing: false,
});

const props = defineProps({
  confins: {
    type: Array,
    default: () => [],
  },
});

const actions = {
  async init() {
    await actions.gridConfins();
    await actions.getDadosParaInputs();
  },

  async gridConfins() {
    state.grid = new xGridV2.create({
      el: "#gridConfins",
      height: 325,
      count: true,
      columns: {
        Valor: { dataField: "P_VALOR", width: "50%" },
        Tributário: { dataField: "ID_REGIME_TRIBUTARIO", width: "50%" },
      },
      query: {
        async execute(rs) {
          let data = await actions.getDadosParaInputs();
          state.grid.querySourceAdd(data);
        },
      },
      sideBySide: {
        el: "#pnConfinsCampos",
        vModel(r) {
          state.confins = r;
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
          el: "#pnConfinsBotoes",
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
              id: "btnConfinsUpdate",
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
        document.getElementById("btnConfinsUpdate")?.click();
      },
    });
  },

  async getDadosParaInputs() {
    try {
      state.loading = true;

      const data = await serviceNfe.getDadosParaInputs();

      state.confins = data.cofins[0];
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
    state.confins = {} as iCofins;
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
        await serviceNfe.toDeleteCofins(selected.ID_COFINS);
        state.grid.deleteLine();
        Swal.fire({
          icon: "success",
          text: "COFINS excluído com sucesso!",
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

      if (state.confins.ID_COFINS) {
        await serviceNfe.toUpdateCofins(state.confins);
        state.grid.dataSource({ ...state.confins });
        Swal.fire({
          icon: "success",
          text: "COFINS atualizado com sucesso!",
        });
      } else {
        const response = await serviceNfe.toInsertCofins(state.confins);
        state.confins.ID_COFINS = response.ID_COFINS;
        state.grid.insertLine({ ...state.confins });
        Swal.fire({
          icon: "success",
          text: "COFINS cadastrado com sucesso!",
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
    state.confins = {} as iCofins;
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

      <h2 class="text-center mb-4">Configuração de COFINS</h2>

      <v-form
        @submit.prevent="actions.btnSave"
        id="pnConfinsCampos"
      >
        <v-row>
          <v-col cols="4">
            <v-select
              v-model="state.confins.ID_REGIME_TRIBUTARIO"
              :items="state.confinsLista"
              item-title="DESCRICAO"
              item-value="ID_REGIME_TRIBUTARIO"
              label="Regime Tributário"
            />
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="state.confins.P_VALOR"
              label="Valor do COFINS"
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
        id="gridConfins"
        class="mb-4"
      />
      <div
        id="pnConfinsBotoes"
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
