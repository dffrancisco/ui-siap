<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { onMounted, reactive, ref } from "vue";
import serviceFaturarCliente from "../services/faturarCliente.service";
import Swal from "sweetalert2";

const props = defineProps({
  dataLimite: {
    type: String,
    default: moment().format("YYYY-MM-DD"),
  },
});

const emits = defineEmits(["closeModal"]);

const inputSearch = ref();

const state = reactive({
  gridCliente: <ixGridCreate>{},
  loading: false,
  dbClienteFaturado: {},
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
          let data = await actions.getClientesFaturados({
            offset: rs.offset,
            param: rs.param,
          });
          state.gridCliente.querySourceAdd(data);
        },
      },
    });
  },

  closeModal() {
    emits("closeModal");
  },

  async getClientesFaturados({ param, offset }) {
    try {
      state.loading = true;

      const data = await serviceFaturarCliente.getClientesFaturados({ param, offset });

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
      dataLimite: props.dataLimite,
    });
  },
};

onMounted(async () => {
  await actions.init();

  state.gridCliente.queryOpen(
    {
      search: "",
      dataLimite: props.dataLimite,
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

    <div class="d-flex justify-end ga-4 mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModal"
        >cancelar</v-btn
      >
      <v-btn color="primary">selecionar</v-btn>
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
