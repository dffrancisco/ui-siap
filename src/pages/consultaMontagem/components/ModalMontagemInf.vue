<script lang="ts" setup>
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { nextTick, reactive, watch, computed } from "vue";
import utils from "@/ts/utils";
import VueApexCharts from "vue3-apexcharts";
import { iMontagemDetalhes, iDadosToGraficoDia } from "../interfaces";

const props = defineProps<{
  modalOpened: boolean;
  dbMontagemDetalhes: iMontagemDetalhes;
}>();

const dadosToGrafico = computed(() => {
  const cabecalho = [];
  const dados = [];

  if (state.dbDadosToGraficoDia.length > 0) {
    state.dbDadosToGraficoDia.forEach((item) => {
      cabecalho.push(item.DIA);
      dados.push(item.VALOR);
    });
  }

  return {
    labels: cabecalho,
    series: dados,
  };
});
watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.gridMontagens.source(props.dbMontagemDetalhes.montagemDetalhes);
      state.gridDevolucoes.source(props.dbMontagemDetalhes.devolucaoDetalhes);
      state.dbDadosToGraficoDia = props.dbMontagemDetalhes.dadosToGraficoDia;
    }
  }
);

const state = reactive({
  gridMontagens: <ixGridCreate>{},
  gridDevolucoes: <ixGridCreate>{},

  dbDadosToGraficoDia: <iDadosToGraficoDia[]>[],

  loading: false,
});

const actions = {
  criarGrids() {
    state.gridMontagens = new xGridV2.create({
      el: "#gridMontagens",
      height: 250,
      width: 420,
      count: false,
      columns: {
        Valor: { dataField: "VALOR", render: utils.formatValor, center: true },
        Data: { dataField: "DATA", render: utils.dataBrasil, center: true },
        "N° Orçamento": { dataField: "NUM_ORCAMENTO", center: true },
        Placa: { dataField: "PLACA", center: true },
        Vendedor: { dataField: "VENDEDOR", width: "30%" },
      },
    });

    state.gridDevolucoes = new xGridV2.create({
      el: "#gridDevolucoes",
      height: 250,
      width: 420,
      count: false,
      columns: {
        "N° Orçamento": { dataField: "NUM_ORCAMENTO", center: true },
        Venda: { dataField: "DATA_VENDA", render: utils.dataBrasil, center: true },
        Valor: { dataField: "VALOR", render: utils.formatValor, center: true },
        Placa: { dataField: "PLACA", center: true },
        "Dt Dev": { dataField: "DATA", render: utils.dataBrasil, center: true },
      },
    });
  },
};

nextTick(async () => {
  actions.criarGrids();
});
</script>

<template>
  <v-container>
    <v-row class="d-flex justify-center pb-5">
      <div class="mr-2">
        <span>Montagens</span>
        <div id="gridMontagens"> </div>
      </div>
      <div>
        <span>Devolução</span>
        <div id="gridDevolucoes"> </div>
      </div>
    </v-row>

    <span>Venda por Dia</span>
    <VueApexCharts
      width="100%"
      height="350"
      type="bar"
      :options="{
        chart: {
          id: 'basic-bar',
        },
        xaxis: {
          categories: dadosToGrafico.labels,
        },
        yaxis: {
          labels: {
            formatter: (value: number) => utils.formatValor(value),
          },
        },
      }"
      :series="[
        {
          name: 'Venda do Dia',
          data: dadosToGrafico.series,
        },
      ]"
    />

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
  </v-container>
</template>
