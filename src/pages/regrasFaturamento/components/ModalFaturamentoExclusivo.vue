<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { useEventListener } from "@vueuse/core";
import { onMounted, onUnmounted, reactive } from "vue";

const emits = defineEmits(["openModalSelecionarCliente", "closeModal"]);

const state = reactive({
  gridFaturamentoExclusivo: <ixGridCreate>null,
  inputSearchElement: <HTMLInputElement>null,
});

const actions = {
  async init() {
    state.inputSearchElement = document.getElementById("inputSearch") as HTMLInputElement;

    await actions.criarGrid();
  },

  async openModalSelecionarCliente() {
    emits("openModalSelecionarCliente");
  },

  async criarGrid() {
    state.gridFaturamentoExclusivo = new xGridV2.create({
      el: "#gridFaturamentoExclusivo",
      count: true,
      height: "300px",
      columns: {
        "Razão Social": { dataField: "RAZAO_SOCIAL" },
        CNPJ: { dataField: "CNPJ", width: "25%" },
      },
    });
  },

  async closeModal() {
    emits("closeModal");
  },
};

onMounted(() => {
  actions.init();
});

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.inputSearchElement.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-card class="pa-4">
    <v-card-title>Selecionar Faturamento Exclusivo</v-card-title>

    <div class="mt-4 d-flex ga-2">
      <v-text-field
        label="F1 - Pesquisar (Razão Social ou CNPJ)"
        :clearable="false"
        autofocus
        id="inputSearch"
      ></v-text-field>
      <v-btn
        color="primary"
        size="36"
        icon="mdi-magnify mdi-24px"
      ></v-btn>
    </div>

    <div
      class="mt-2"
      id="gridFaturamentoExclusivo"
    ></div>

    <div class="mt-4 d-flex justify-space-between">
      <div class="d-flex ga-2">
        <v-btn
          color="red-darken-2"
          size="36"
          title="Excluir Faturamento Exclusivo"
          icon="mdi-delete mdi-24px"
        ></v-btn>

        <v-btn
          color="primary"
          @click="actions.openModalSelecionarCliente"
          size="36"
          title="Adicionar Cliente"
          icon="mdi-account-plus mdi-24px"
        ></v-btn>
      </div>

      <div class="d-flex ga-2">
        <v-btn
          color="primary"
          variant="outlined"
          @click="actions.closeModal"
          >cancelar</v-btn
        >
        <v-btn color="primary">selecionar</v-btn>
      </div>
    </div>
  </v-card>
</template>
