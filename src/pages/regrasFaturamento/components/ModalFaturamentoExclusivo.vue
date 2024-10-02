<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { useEventListener } from "@vueuse/core";
import { onMounted, onUnmounted, reactive } from "vue";
import serviceRegrasFaturamento from "../services/regrasFaturamento.service";
import Swal from "sweetalert2";

const emits = defineEmits(["openModalSelecionarCliente", "closeModal"]);

const state = reactive({
  gridFaturamentoExclusivo: <ixGridCreate>null,
  inputSearchElement: <HTMLInputElement>null,
  loading: false,
});

const actions = {
  async init() {
    state.inputSearchElement = document.getElementById("inputSearch") as HTMLInputElement;
    await actions.criarGrid();

    state.gridFaturamentoExclusivo.queryOpen({
      search: "",
    });
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
      query: {
        async execute(rs) {
          // @ts-ignore
          const data = await actions.getFaturamentosExclusivos(rs.offset, rs.param.search);
          state.gridFaturamentoExclusivo.querySourceAdd(data);
        },
      },
    });
  },

  async closeModal() {
    emits("closeModal");
  },

  async getFaturamentosExclusivos(offset: number, search: string) {
    try {
      state.loading = true;

      const data = serviceRegrasFaturamento.getFaturamentosExclusivos(offset, search);

      return data;
    } catch (error) {
      Swal.fire({
        title: "Erro ao buscar os faturamentos exclusivos.",
        text: error.message,
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  async btnSearch() {
    state.gridFaturamentoExclusivo.queryOpen({
      search: state.inputSearchElement.value,
    });
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
        @keydown.arrow.down.prevent="state.gridFaturamentoExclusivo.focus()"
        @keydown.enter.prevent="actions.btnSearch()"
      ></v-text-field>
      <v-btn
        color="primary"
        size="36"
        icon="mdi-magnify mdi-24px"
        @click="actions.btnSearch()"
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

  <v-overlay
    :model-value="state.loading"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>
