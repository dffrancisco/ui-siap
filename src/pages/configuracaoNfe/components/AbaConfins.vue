<script setup lang="ts">
import { onMounted, reactive } from "vue";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import Swal from "sweetalert2";
import { msgConfirm } from "@/ts/message";
import utils from "@/ts/utils";
import serviceNfe from "../services/configuracaoNfe.service";

const state = reactive({
  grid: {} as ixGridCreate,
  confinsLista: [] as any[],
  confins: {} as any,
  loading: false,
  isEditing: false,
});

const actions = {
  async init() {
    await actions.gridRegimeTributario();
  },

  gridRegimeTributario() {
    state.grid = new xGridV2.create({
      el: "#gridRegimeTributario",
      height: 325,
      count: true,
      columns: {
        Valor: { dataField: "P_VALOR", width: "50%" },
        "Código Regime Tributário": { dataField: "ID_REGIME_TRIBUTARIO", width: "50%" },
      },
      query: {
        async execute(rs) {
          const data = await actions.getDadosParaInputs();
          state.grid.querySourceAdd(data);
        },
      },
      sideBySide: {
        el: "#pnRegimeCampos",
        vModel(r) {
          state.confins = r;
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

    actions.getDadosParaInputs().then((data) => {});
  },

  async getDadosParaInputs() {
    try {
      state.loading = true;

      const data = await serviceNfe.getDadosParaInputs();
      state.confinsLista = data.regimeTributario;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Erro ao buscar os dados iniciais!",
      });
    } finally {
      state.loading = false;
    }
  },

  btnInsert() {
    state.isEditing = true;
    state.confins = {};
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
    if (!state.grid.dataSource()) {
      Swal.fire({
        icon: "info",
        text: "Selecione um registro para excluir.",
      });
      return;
    }
    if (await msgConfirm("Confirmação", "Confirma a exclusão deste registro?")) {
      try {
        state.loading = true;
        await serviceNfe.toDeleteRegimeTributario(state.grid.dataSource().ID_REGIME_TRIBUTARIO);
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
      if (state.confins.ID_REGIME_TRIBUTARIO) {
        await serviceNfe.toUpdateRegimeTributario(state.confins);
        state.grid.dataSource({ ...state.confins });
        Swal.fire({
          icon: "success",
          text: "Registro atualizado com sucesso!",
        });
      } else {
        const response = await serviceNfe.toUpdateCofins(state.confins);
        state.confins.ID_REGIME_TRIBUTARIO = response.id;
        state.grid.insertLine({ ...state.confins });
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

  async btnCancel() {
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
      <h2 class="text-center">Regime Tributário</h2>

      <v-form
        @submit.prevent="actions.btnSave"
        id="pnRegimeCampos"
      >
        <v-row dense>
          <v-col cols="3">
            <v-text-field
              v-model="state.confins.ID_REGIME_TRIBUTARIO"
              label="Código Tributário"
              type="number"
              outlined
              dense
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="state.confins.DESCRICAO"
              label="Descrição"
              type="text"
              outlined
              dense
            />
          </v-col>
        </v-row>
        <v-row
          justify="center"
          class="mt-3"
        >
          <v-btn
            color="primary"
            class="ma-1"
            @click="actions.btnSave"
            :loading="state.loading"
          >
            Salvar
          </v-btn>
          <v-btn
            color="secondary"
            class="ma-1"
            @click="actions.btnCancel"
          >
            Cancelar
          </v-btn>
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
