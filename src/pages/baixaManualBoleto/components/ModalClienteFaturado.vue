<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { onMounted, reactive, ref } from "vue";
import { iClientesFaturados, iGetClientesFaturados } from "../interfaces";
import serviceBaixaManualBoleto from "../services/baixaManualBoleto.service";
import Swal from "sweetalert2";
const emits = defineEmits(["closeModalClienteFaturado", "selecionarClienteFaturado"]);
const inputSearch = ref();

const state = reactive({
  loading: false,
  gridClientesFaturados: <ixGridCreate>{},
  dbClientesFaturados: <iClientesFaturados>{},
});

const actions = {
  async init() {
    actions.criarGrid();
  },

  criarGrid() {
    state.gridClientesFaturados = new xGridV2.create({
      el: "#gridClientesFaturados",
      count: true,
      height: 300,
      columns: {
        Nome: { dataField: "CLIENTE" },
        CNPJ: { dataField: "CNPJ", width: "25%", center: true },
      },
      query: {
        async execute(rs) {
          let data = await actions.getClientesFaturados(rs.param as iGetClientesFaturados, rs.offset);
          state.gridClientesFaturados.querySourceAdd(data);
        },
      },
      enter: () => actions.validarInputs(),
      dblClick: () => actions.validarInputs(),
    });
  },

  closeModalClientesFaturados() {
    emits("closeModalClienteFaturado");
  },

  async getClientesFaturados(param: iGetClientesFaturados, offset: number) {
    try {
      state.loading = true;

      const data = await serviceBaixaManualBoleto.getClientesFaturados(param, offset);
      return data;
    } catch (error) {
      Swal.fire({
        text: "Erro ao buscar os Clientes Faturados",
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  async btnSearch() {
    state.gridClientesFaturados.queryOpen({
      search: inputSearch.value.value,
    });
  },

  validarInputs() {
    if (!state.gridClientesFaturados.dataSource()) {
      Swal.fire({
        text: "Nenhum cliente foi selecionado",
        icon: "warning",
      });
      return false;
    }

    actions.selecionarClienteFaturado();
  },

  selecionarClienteFaturado() {
    const clienteFaturadoSelecionado = state.gridClientesFaturados.dataSource();
    emits("selecionarClienteFaturado", clienteFaturadoSelecionado);
    actions.closeModalClientesFaturados();
  },
};

onMounted(async () => {
  await actions.init();

  state.gridClientesFaturados.queryOpen(
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
            @keydown.arrow.down.prevent="state.gridClientesFaturados.focus()"
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
      id="gridClientesFaturados"
    ></div>
    <div class="d-flex justify-end ga-4 mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModalClientesFaturados"
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
