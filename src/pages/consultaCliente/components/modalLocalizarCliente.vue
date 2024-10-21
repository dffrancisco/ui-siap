<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import moment from "moment";
import { onMounted, reactive, ref } from "vue";
import { iClientes, iGetClientes } from "../interfaces";
import serviceConsultaCliente from "../services/consultaCliente.service";
import Swal from "sweetalert2";

const emits = defineEmits(["closeModalLocalizarCliente", "selecionarCliente"]);
const inputSearch = ref();

const state = reactive({
  loading: false,
  dataInicio: moment().startOf("month").format("YYYY-MM-DD"),
  dataFim: moment().format("YYYY-MM-DD"),
  inputDataFinal: <HTMLInputElement>{},
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
        CNPJ: { dataField: "CGC_CLIENTE", width: "15%" },
        Nome: { dataField: "NOME" },
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

  closeModalLocalizarCliente() {
    emits("closeModalLocalizarCliente");
  },

  async getClientes(param: iGetClientes, offset: number) {
    try {
      state.loading = true;

      const data = await serviceConsultaCliente.getClientes(param, offset);

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

    const dataInicial = moment(state.dataInicio, "YYYY-MM-DD");
    const dataFinal = moment(state.dataFim, "YYYY-MM-DD");

    if (!dataInicial.isValid() || !dataFinal.isValid()) {
      Swal.fire({
        icon: "warning",
        text: "Data Inválida!",
      });
      return false;
    }

    if (dataInicial.isAfter(dataFinal)) {
      Swal.fire({
        icon: "warning",
        text: "Data inicial maior que a data final!",
      });
      return false;
    }

    const diferencaMeses = dataFinal.diff(dataInicial, "months", true);

    if (diferencaMeses >= 12) {
      Swal.fire({
        icon: "warning",
        text: "O intervalo entre as datas não pode ser maior que doze meses!",
      });
      return false;
    }

    actions.selecionarCliente();
  },

  selecionarCliente() {
    const clienteSelecionado = state.gridClientes.dataSource();
    emits("selecionarCliente", clienteSelecionado, state.dataInicio, state.dataFim);
    actions.closeModalLocalizarCliente();
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
      state.inputDataFinal = <any>document.getElementById("DATA_FIM");
    }
  );
});
</script>
<template
  ><v-card class="pa-4"
    ><div style="display: flex; gap: 16px">
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

      <v-text-field
        v-model="state.dataInicio"
        label="Data Início"
        type="date"
        :clearable="false"
        @keydown.enter="state.inputDataFinal.focus()"
      >
      </v-text-field>

      <v-text-field
        v-model="state.dataFim"
        label="Data Fim"
        id="DATA_FIM"
        type="date"
        :clearable="false"
      >
      </v-text-field>

      <div class="d-flex align-center">
        <v-btn
          icon="mdi-magnify"
          size="39"
          color="primary"
          @click="actions.btnSearch"
        />
      </div>
    </div>
    <div
      class="mt-4"
      id="gridClientes"
    ></div>
    <div class="d-flex justify-end ga-4 mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        @click="actions.closeModalLocalizarCliente"
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
<style scoped></style>
