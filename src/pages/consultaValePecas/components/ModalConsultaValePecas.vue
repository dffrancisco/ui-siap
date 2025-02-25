<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import serviceConsultaValePecas from "../services/consultaValePecas.service";
import { iParamsItemOrcamento, iResponseOrcamento } from "../interfaces";
import Swal from "sweetalert2";
const emits = defineEmits(["closeModalVale", "selecionarVale"]);

const state = reactive({
  loading: false,
  dbDetalheOrçamento: [] as iResponseOrcamento[],
  dadosRelatorio: [] as iParamsItemOrcamento[],
  dbSelectItem: null,
  funcionario: [],
  meses: [],
  mesSelecionado: null,
  headers: <any>[
    { key: "CGC_CLIENTE", title: "Nº Fabricante", sortable: true, align: "left" },
    { key: "NOME", title: "Descrição", sortable: true, align: "left" },
    { key: "UNIDADE", title: "UN", sortable: true, align: "left" },
    { key: "CARRO", title: "Carro", sortable: true, align: "left" },
    { key: "QUANTIDADE", title: "QT", sortable: true, align: "left" },
    { key: "VALOR", title: "Valor", sortable: true, align: "left" },
    { key: "SUB_TOTAL", title: "Total", sortable: true, align: "left" },
  ],

  totalmes: "",
  total: "",
  gridConsultaValePeças: null,
});

const actions = {
  async init() {},

  closeModalConsultaVale() {
    emits("closeModalVale");
  },

  async getOrcamento() {
    try {
      state.loading = true;

      const data = await serviceConsultaValePecas.getOrcamento();
      return data;
    } catch (error) {
      Swal.fire({
        text: "Erro ao buscar os Orcamentos",
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  async getItensOrcamento() {
    try {
      state.loading = true;

      const data = await serviceConsultaValePecas.getItensOrcamento();
      return data;
    } catch (error) {
      Swal.fire({
        text: "Erro ao buscar os Orcamentos",
        icon: "error",
      });
    } finally {
      state.loading = false;
    }
  },

  validarInputs() {
    if (!state.gridConsultaValePeças.dataSource()) {
      Swal.fire({
        text: "Nenhum cliente foi selecionado",
        icon: "warning",
      });
      return false;
    }

    actions.SelecionarVale();
  },

  SelecionarVale() {
    const selecionarValePeca = state.dbSelectItem;
    emits("selecionarVale", selecionarValePeca);
    actions.closeModalConsultaVale();
  },
};

onMounted(async () => {
  await actions.init();
  await actions.getOrcamento();
  await actions.getItensOrcamento();
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
        <v-col cols="3">
          <v-text-field
            label="Nº Orçamento: "
            id="NUM_ORCAMENTO"
            type="text"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Nome Cliente"
            id="NOME_CLIENTE"
            type="text"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            label="Vendedor"
            id="VENDEDOR"
            type="text"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="Mês"
            id="MES"
            type="text"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            label="DATA"
            id="DATA"
            type="datetime"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row class="d-flex align-center">
        <v-col cols="3">
          <v-text-field
            label="Hora"
            id="HORA"
            type="time"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Desconto"
            id="DESCONTO"
            type="number"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Desc. Vendedor"
            id="VALOR_DESCONTO"
            type="number"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field
            label="Valor"
            id="VALOR"
            type="number"
            v-model="state.dbDetalheOrçamento"
            :clearable="false"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-data-table-virtual
        id="tabelaValePeças"
        class="pt-5"
        :items="state.dadosRelatorio"
        :headers="state.headers"
        height="310px"
        fixed-header
      ></v-data-table-virtual>

      <v-row class="mt-4">
        <v-col cols="1">
          <v-btn
            color="primary"
            @click=""
            :disabled="state.dadosRelatorio.length === 0"
            icon
            size="36px"
            style="min-width: 36px"
          >
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </v-col>
        <v-col
          cols="1"
          class="d-flex justify-end"
        >
          <v-btn
            color="primary"
            @click="actions.closeModalConsultaVale"
          >
            Fechar
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
