<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { useEventListener } from "@vueuse/core";
import Swal from "sweetalert2";
import { onMounted, onUnmounted, reactive } from "vue";
import serviceRegrasFaturamento from "../services/regrasFaturamento.service";

const emits = defineEmits(["closeModal", "selecionarCliente"]);

const state = reactive({
  gridClientesFaturados: <ixGridCreate>null,
  inputSearchClienteElement: <HTMLInputElement>null,
  loading: false,
});

const actions = {
  async init() {
    state.inputSearchClienteElement = document.getElementById("inputSearchCliente") as HTMLInputElement;

    await actions.criarGrid();

    state.gridClientesFaturados.queryOpen({
      search: "",
    });
  },

  async btnSearch() {
    state.gridClientesFaturados.queryOpen({
      search: state.inputSearchClienteElement.value,
    });
  },

  async criarGrid() {
    state.gridClientesFaturados = new xGridV2.create({
      el: "#gridClientesFaturados",
      count: true,
      height: "300px",
      columns: {
        "Razão Social": { dataField: "RAZAO_SOCIAL" },
        CNPJ: { dataField: "CNPJ", width: "22%" },
      },
      query: {
        async execute(rs) {
          //@ts-ignore
          const data = await actions.getClientesFaturados(rs.offset, rs.param.search);
          state.gridClientesFaturados.querySourceAdd(data);
        },
      },
      dblClick: actions.selecionarCliente,
      enter: actions.selecionarCliente,
    });
  },

  closeModal() {
    emits("closeModal");
  },

  async selecionarCliente() {
    const cliente = state.gridClientesFaturados.dataSource();

    if (!cliente) {
      Swal.fire({
        title: "Nenhum cliente foi selecionado.",
        icon: "info",
      });
      return;
    }

    emits("selecionarCliente", cliente);
  },

  async getClientesFaturados(offset: number, search: string) {
    try {
      state.loading = true;

      const data = await serviceRegrasFaturamento.getClientesFaturados(offset, search);

      return data;
    } catch (error) {
      Swal.fire({
        title: "Erro ao buscar clientes faturados",
        text: error.message,
        icon: "error",
        confirmButtonText: "Fechar",
      });
    } finally {
      state.loading = false;
    }
  },
};

onMounted(() => {
  actions.init();
});

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.inputSearchClienteElement.select();
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
    <v-card-title>Selecionar Cliente Faturado</v-card-title>

    <div class="mt-4 d-flex ga-2">
      <v-text-field
        label="F1 - Pesquisar (Razão Social ou CNPJ)"
        :clearable="false"
        autofocus
        id="inputSearchCliente"
        @keydown.enter.prevent="actions.btnSearch"
        @keydown.arrow.down.prevent="state.gridClientesFaturados.focus()"
      ></v-text-field>
      <v-btn
        color="primary"
        size="36"
        icon="mdi-magnify mdi-24px"
        @click="actions.btnSearch"
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
        <v-btn
          color="primary"
          @click="actions.selecionarCliente"
          >selecionar</v-btn
        >
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
