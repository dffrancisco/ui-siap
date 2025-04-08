<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { onMounted, reactive, ref } from "vue";
import serviceRelatorioFaturamento from "../services/relatorioFaturamento.service";
import Swal from "sweetalert2";
import { iClienteFaturado, iGetClientesFaturadosParam } from "../interfaces";

const props = defineProps({
  dataInicio: {
    type: String,
    default: moment().format("YYYY-MM-DD"),
  },
  dataFim: {
    type: String,
    default: moment().format("YYYY-MM-DD"),
  },
});

const emits = defineEmits(["closeModal", "selecionarCliente"]);

const inputSearch = ref();

const state = reactive({
  gridCliente: <ixGridCreate>{},
  loading: false,
  dbClienteFaturado: <iClienteFaturado>{},
});

const actions = {
  async init() {
    actions.criarGrid();
  },

  criarGrid() {
    state.gridCliente = new xGridV2.create({
      el: "#gridCliente",
      count: true,
      height: 300,
      columns: {
        "Razão Social": { dataField: "NOME" },
        CNPJ: { dataField: "CGC_CLIENTE", width: "25%", center: true },
      },
      query: {
        async execute(rs) {
          let data = await actions.getClientesFaturados(rs.param as iGetClientesFaturadosParam, rs.offset);
          state.gridCliente.querySourceAdd(data);
        },
      },
      enter: () => actions.selecionarCliente(),
      dblClick: () => actions.selecionarCliente(),
    });
  },

  closeModal() {
    emits("closeModal");
  },

  async getClientesFaturados(param: iGetClientesFaturadosParam, offset?: number) {
    try {
      state.loading = true;

      const data = await serviceRelatorioFaturamento.getClientesFaturados(param, offset);

      return data;
    } catch (error) {
      Swal.fire({
        text: "Erro ao buscar os clientes faturados",
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  async btnSearch() {
    state.gridCliente.queryOpen({
      search: inputSearch.value.value,
      dataInicio: props.dataInicio,
      dataFim: props.dataFim,
    });
  },

  selecionarCliente() {
    if (!state.gridCliente.dataSource()) {
      Swal.fire({
        text: "Nenhum cliente foi selecionado",
        icon: "warning",
      });
      return false;
    }

    const clienteSelecionado: iClienteFaturado = state.gridCliente.dataSource();

    emits("selecionarCliente", clienteSelecionado);

    actions.closeModal();
  },

  async selecionarClienteContorno() {
    let clienteContorno = await actions.getClientesFaturados({
      contorno: true,
    });

    emits("selecionarCliente", clienteContorno);
    actions.closeModal();
  },
};

onMounted(async () => {
  await actions.init();

  state.gridCliente.queryOpen(
    {
      search: "",
      dataInicio: props.dataInicio,
      dataFim: props.dataFim,
    },
    () => {
      inputSearch.value.focus();
    }
  );
});
</script>

<template>
  <v-card class="pa-4 d-flex flex-grow-1">
    <div class="d-flex ga-4">
      <v-text-field
        type="text"
        placeholder="Razão social / CNPJ"
        density="compact"
        ref="inputSearch"
        @keydown.enter.prevent="actions.btnSearch"
        @keydown.arrow.down.prevent="state.gridCliente.focus()"
      />
      <div class="d-flex align-center">
        <v-btn
          icon="mdi-magnify"
          size="34"
          color="primary"
          @click="actions.btnSearch"
        />
      </div>
    </div>

    <div
      class="mt-4"
      id="gridCliente"
    ></div>

    <div class="d-flex justify-space-between mt-4 align-center">
      <v-btn
        size="x-small"
        color="primary"
        icon="mdi-alpha-c-circle mdi-24px"
        title="Selecionar Contorno"
        @click="actions.selecionarClienteContorno"
      >
      </v-btn>
      <div class="d-flex justify-end ga-4">
        <v-btn
          color="primary"
          variant="outlined"
          @click="actions.closeModal"
          >cancelar</v-btn
        >
        <v-btn
          @click="actions.selecionarCliente"
          color="primary"
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
