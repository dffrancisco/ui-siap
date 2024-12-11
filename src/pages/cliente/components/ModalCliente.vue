<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, ref } from "vue";
import { iClientes, iGetClientes } from "../interfaces";
import serviceCliente from "../services/cliente.service";
import Swal from "sweetalert2";
const emits = defineEmits(["closeModalCliente", "selecionarCliente"]);
const inputSearch = ref();

const state = reactive({
  loading: false,
  gridClientes: <ixGridCreate>{},
  dbClientes: <iClientes>{},
});

const actions = {
  async init() {
    actions.criarGrid();
  },

  criarGrid() {
    state.gridClientes = new xGridV2.create({
      el: "#gridClientes",
      count: true,
      height: 300,
      columns: {
        CNPJ: { dataField: "CGC_CLIENTE", width: "18%" },
        Nome: { dataField: "NOME", width: "45%" },
        Endereço: { dataField: "ENDERECO" },
      },
      query: {
        async execute(rs) {
          let data = await actions.getClientes(rs.param as iGetClientes, rs.offset);
          state.gridClientes.querySourceAdd(data);
        },
      },
      enter: () => actions.validarInputs(),
      dblClick: () => actions.validarInputs(),
    });
  },

  closeModalCliente() {
    emits("closeModalCliente");
  },

  async getClientes(param: iGetClientes, offset: number) {
    try {
      state.loading = true;

      const data = await serviceCliente.getClientes(param, offset);
      return data;
    } catch (error) {
      Swal.fire({
        text: "Erro ao buscar os clientes",
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  async btnSearch() {
    state.gridClientes.queryOpen({
      search: inputSearch.value.value,
    });
  },

  validarInputs() {
    if (!state.gridClientes.dataSource()) {
      Swal.fire({
        text: "Nenhum cliente foi selecionado",
        icon: "warning",
      });
      return false;
    }

    actions.selecionarCliente();
  },

  selecionarCliente() {
    const clienteSelecionado = state.gridClientes.dataSource();
    emits("selecionarCliente", clienteSelecionado);
    actions.closeModalCliente();
  },
};

onMounted(async () => {
  await actions.init();

  state.gridClientes.queryOpen(
    {
      search: "",
    },
    () => {
      inputSearch.value.focus();
    }
  );
});
</script>
<template
  ><v-card class="pa-4">
    <v-row>
      <v-col>
        <div class="d-flex ga-2">
          <v-text-field
            label="Razão social / CNPJ"
            :clearable="true"
            width="300px"
            density="compact"
            autofocus
            ref="inputSearch"
            @keydown.enter.prevent="actions.btnSearch"
            @keydown.arrow.down.prevent="state.gridClientes.focus()"
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
      id="gridClientes"
    ></div>
    <div class="d-flex justify-end ga-4 mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModalCliente"
        >cancelar</v-btn
      >
      <v-btn
        @click="actions.validarInputs"
        color="primary"
        >selecionar</v-btn
      >
    </div>
  </v-card>
</template>
