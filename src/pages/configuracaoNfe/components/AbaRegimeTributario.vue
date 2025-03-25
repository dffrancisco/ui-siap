<script setup>
import { onMounted, computed } from "vue";
import { reactive } from "vue";
import Swal from "sweetalert2";
import utils from "@/ts/utils";
import { msgConfirm } from "@/ts/message";
import serviceNfe from "@/services/configuracaoNfe.service";

const state = reactive({
  regimeTributarioLista: [],
  regimeTributario: {},
  loading: false,
  isEditing: false,
  originalData: {},
});

const actions = {
  async getRegimeTributario() {
    try {
      state.loading = true;
      const data = await serviceNfe.getRegimeTributario();
      state.regimeTributarioLista = data;
    } catch (error) {
      Swal.fire({ icon: "error", text: "Erro ao buscar Regimes Tributários!" });
    } finally {
      state.loading = false;
    }
  },

  btnInsert() {
    state.isEditing = true;
    state.regimeTributario = {};
  },

  btnEdit(item) {
    state.isEditing = true;
    state.regimeTributario = { ...item };
    state.originalData = { ...item };
  },

  async btnSave() {
    if (utils.validaOBR()) return;
    try {
      state.loading = true;
      if (state.regimeTributario.ID_REGIME_TRIBUTARIO) {
        await serviceNfe.updateRegimeTributario(state.regimeTributario);
      } else {
        await serviceNfe.createRegimeTributario(state.regimeTributario);
      }
      Swal.fire({ icon: "success", text: "Registro salvo com sucesso!" });
      state.isEditing = false;
      actions.getRegimeTributario();
    } catch (error) {
      Swal.fire({ icon: "error", text: error.response?.data?.msg || "Erro ao salvar" });
    } finally {
      state.loading = false;
    }
  },

  async btnDelete(id) {
    const confirm = await msgConfirm("Confirma exclusão deste registro?");
    if (!confirm.isConfirmed) return;
    try {
      state.loading = true;
      await serviceNfe.deleteRegimeTributario(id);
      Swal.fire({ icon: "success", text: "Registro excluído!" });
      actions.getRegimeTributario();
    } catch (error) {
      Swal.fire({ icon: "error", text: "Erro ao excluir" });
    } finally {
      state.loading = false;
    }
  },

  btnCancel() {
    state.regimeTributario = { ...state.originalData };
    state.isEditing = false;
  },
};

onMounted(() => {
  actions.getRegimeTributario();
});

const regimeOptions = computed(() => {
  return state.regimeTributarioLista.map((item) => ({
    text: item.DESCRICAO,
    value: item.ID_REGIME_TRIBUTARIO,
  }));
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

      <h2 class="text-center">Regime Tributário</h2>

      <v-form @submit.prevent="actions.btnSave">
        <v-row dense>
          <v-col cols="3">
            <v-text-field
              v-model="state.regimeTributario.ID_REGIME_TRIBUTARIO"
              label="Código Tributário"
              type="number"
              outlined
              dense
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="state.regimeTributario.DESCRICAO"
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

      <v-data-table-virtual
        :items="state.regimeTributarioLista"
        :headers="[
          { text: 'Código', value: 'ID_REGIME_TRIBUTARIO' },
          { text: 'Descrição', value: 'DESCRICAO' },
          { text: 'Ações', value: 'actions', sortable: false },
        ]"
        height="325"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="blue"
            class="ma-1"
            @click="actions.btnEdit(item)"
          >
            Editar
          </v-btn>
          <v-btn
            color="red"
            class="ma-1"
            @click="actions.btnDelete(item.ID_REGIME_TRIBUTARIO)"
          >
            Excluir
          </v-btn>
        </template>
        </template>
      </v-data-table-virtual>
    </v-card>
  </v-container>
</template>
