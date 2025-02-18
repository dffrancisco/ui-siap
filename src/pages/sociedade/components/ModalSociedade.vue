<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, ref } from "vue";
import { iCliente } from "../interfaces";
import serviceSociedade from "../services/sociedade.service";
import Swal from "sweetalert2";
const emits = defineEmits(["closeModalCliente", "selecionarCliente"]);
const inputSearch = ref();

const state = reactive({
  loading: false,
  gridCliente: <ixGridCreate>{},
  dbCliente: <iCliente>{},
  edtSearch: "",
});

const actions = {
  async init() {
    actions.criarGrid();
  },

  criarGrid() {
    state.gridCliente = new xGridV2.create({
      el: "#gridCliente",
      count: true,
      height: 200,
      columns: {
        Cliente: { dataField: "NOME" },
        CNPJ: { dataField: "CGC_CLIENTE" },
      },

      query: {
        async execute(rs) {
          let data = await actions.getCliente(state.edtSearch, rs.offset);
          state.gridCliente.querySourceAdd(data);
        },
      },

      enter: () => actions.validarInputs(),
      dblClick: () => actions.validarInputs(),
    });
  },

  closeModalCliente() {
    emits("closeModalCliente");
  },
  async getCliente(param: string, offset: number) {
    try {
      state.loading = true;
      const data = await serviceSociedade.getCliente(param, offset);
      state.gridCliente.querySourceAdd(data);
      return data;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        text: "Erro ao exibir registro de Cliente",
      });
    } finally {
      state.loading = false;
    }
  },

  async btnSearch() {
    state.gridCliente.queryOpen({
      search: state.edtSearch,
    });
  },

  validarInputs() {
    if (!state.gridCliente.dataSource()) {
      Swal.fire({
        text: "Nenhum cliente foi selecionado",
        icon: "warning",
      });
      return false;
    }

    actions.selecionarCliente();
  },

  selecionarCliente() {
    const clienteSelecionado = state.gridCliente.dataSource();
    emits("selecionarCliente", clienteSelecionado);
    actions.closeModalCliente();
  },
};

onMounted(async () => {
  await actions.init();

  state.gridCliente.queryOpen(
    {
      search: "",
    },
    () => {
      inputSearch.value.focus();
    }
  );
});
</script>

<template>
  <v-card class="pa-4">
    <v-row>
      <v-col>
        <div class="d-flex ga-2">
          <v-text-field
            label="Cliente/CNPJ"
            :clearable="true"
            width="300px"
            density="compact"
            autofocus
            ref="inputSearch"
            v-model="state.edtSearch"
            @keydown.enter.prevent="actions.btnSearch"
            @keydown.arrow.down.prevent="state.gridCliente.focus()"
          ></v-text-field>

          <div class="d-flex align-center">
            <v-btn
              icon="mdi-magnify"
              size="39"
              color="primary"
              @click="actions.btnSearch"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <div
      class="mt-4"
      id="gridCliente"
    ></div>
    <div class="d-flex justify-end ga-4 mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModalCliente"
        >Cancelar</v-btn
      >
      <v-btn
        @click="actions.validarInputs"
        color="primary"
        >Selecionar</v-btn
      >
    </div>
  </v-card>
</template>
