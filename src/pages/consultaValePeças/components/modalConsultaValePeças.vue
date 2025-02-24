<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import serviceConsultaValePeças from "./services/consultaValePeças.service";
import { iParamsValePeca } from "./interfaces";
import Swal from "sweetalert2";
const emits = defineEmits(["closeModalConsultaValePeças", "ConsultaValePeças"]);
const inputSearch = ref();

const state = reactive({
  loading: false,
  dbDetalheOrçamento: <iParamsValePeca>{},
  dbSelectItem: null,
  funcionario: [],
  dataInicio: "",
  dataFim: "",
  meses: [],
  mesSelecionado: null,
  ano: new Date().getFullYear(),
  numeroOrcamento: null,
  dadosRelatorio: [],
  headers: [
    { text: "Nº Fabricante", value: "CGC_CLIENTE", width: "18%" },
    { text: "Descrição", value: "NOME", width: "45%" },
    { text: "UN", value: "UNIDADE" },
    { text: "Carro", value: "CARRO" },
    { text: "QT", value: "QUANTIDADE" },
    { text: "Valor", value: "VALOR" },
    { text: "Total", value: "SUB_TOTAL" },
  ],
  totalmes: "",
  total: "",
  gridConsultaValePeças: null,
});

const actions = {
  async init() {},

  closeModalConsultaValePeças() {
    emits("closeModalConsultaValePeças");
  },

  async getConsultaValePeça(param: iParamsValePeca, offset: number) {
    try {
      state.loading = true;

      const data = await serviceConsultaValePeças.getConsultaValePeça(param, offset);
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

  async Search() {
    state.gridConsultaValePeças.queryOpen({
      search: inputSearch.value.value,
    });
  },

  validarInputs() {
    if (!state.gridConsultaValePeças.dataSource()) {
      Swal.fire({
        text: "Nenhum cliente foi selecionado",
        icon: "warning",
      });
      return false;
    }

    actions.ConsultaValePeças();
  },

  ConsultaValePeças() {
    const clienteSelecionado = state.gridConsultaValePeças.dataSource();
    emits("ConsultaValePeças", clienteSelecionado);
    actions.closeModalConsultaValePeças();
  },
};

onMounted(async () => {
  await actions.init();

  state.gridConsultaValePeças.queryOpen(
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
  <v-container>
    <v-card
      class="pa-5 ma-auto"
      :max-width="900"
      :max-height="600"
    >
      <v-row>
        <v-col cols="6">
          <v-autocomplete
            id="slFuncionario"
            v-model="state.dbSelectItem"
            :items="state.funcionario"
            item-value="value"
            item-title="label"
            clearable
            style="width: 100%"
            label="Funcionário"
          ></v-autocomplete>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Data de Início"
            id="dataInicio"
            type="date"
            v-model="state.dataInicio"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Data de Fim"
            id="dataFim"
            type="date"
            v-model="state.dataFim"
            :clearable="false"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row class="d-flex align-center">
        <v-col cols="4">
          <v-select
            label="Mês"
            id="Mes"
            :items="state.meses"
            v-model="state.mesSelecionado"
            :clearable="false"
          ></v-select>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Ano"
            id="ano"
            type="number"
            v-model="state.ano"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            label="Nº Orçamento"
            id="numeroOrcamento"
            type="number"
            v-model="state.numeroOrcamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col
          cols="1"
          class="d-flex justify-center"
        >
          <v-btn
            color="primary"
            icon="mdi-magnify"
            size="36px"
            title="Pesquisar"
            @click="actions.validarInputs"
          >
            <v-icon left>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table-virtual
        id="tabelaValePeças"
        class="pt-5"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        height="310px"
        fixed-header
        :loading="state.loading"
      ></v-data-table-virtual>

      <v-row class="mt-4">
        <v-col cols="6">
          <v-text-field
            label="Total mês"
            v-model="state.totalmes"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="5">
          <v-text-field
            label="Total"
            v-model="state.total"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="1">
          <v-btn
            color="primary"
            @click="actions.onClickImprimir"
            :disabled="state.dadosRelatorio.length === 0"
            icon
            size="36px"
            style="min-width: 36px"
          >
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <div id="pnCodigoTela">consultaValePeças</div>

    <v-overlay
      :model-value="state.loading"
      class="d-flex align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<style>
#tabelaValePeças .v-data-table-footer {
  max-height: 2px;
  padding-top: 20px;
}
#tabelaValePeças .v-data-table-footer__pagination {
  padding-right: 50px;
}

.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>
