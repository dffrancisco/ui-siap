<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive } from "vue";

const emits = defineEmits(["closeModal"]);

const state = reactive({
  gridClientesFaturados: <ixGridCreate>null,
});

const actions = {
  async init() {
    await actions.criarGrid();
  },

  async criarGrid() {
    state.gridClientesFaturados = new xGridV2.create({
      el: "#gridClientesFaturados",
      count: true,
      height: "300px",
      columns: {
        "Razão Social": { dataField: "RAZAO_SOCIAL" },
        CNPJ: { dataField: "CNPJ", width: "25%" },
      },
    });
  },

  closeModal() {
    emits("closeModal");
  },
};

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-card class="pa-4">
    <v-card-title>Selecionar Cliente Faturado</v-card-title>

    <div class="mt-4 d-flex ga-2">
      <v-text-field
        label="F1 - Pesquisar (Razão Social ou CNPJ)"
        :clearable="false"
        autofocus
      ></v-text-field>
      <v-btn
        color="primary"
        size="36"
        icon="mdi-magnify mdi-24px"
      ></v-btn>
    </div>

    <div
      class="mt-2"
      id="gridClientesFaturados"
    ></div>

    <div class="mt-4 d-flex justify-end">
      <div class="d-flex ga-2">
        <v-btn
          @click="actions.closeModal"
          color="primary"
          variant="outlined"
          >cancelar</v-btn
        >
        <v-btn color="primary">selecionar</v-btn>
      </div>
    </div>
  </v-card>
</template>
