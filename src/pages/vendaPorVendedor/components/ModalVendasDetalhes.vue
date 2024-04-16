<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import { nextTick, reactive, watch, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { iVendaDetalhes, iVendaGraficoDetalhes } from "../interfaces";

const props = defineProps<{
  dbVendasDetalhes: iVendaDetalhes;
  modalOpened: boolean;
}>();

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.gridDevolucoes.source(props.dbVendasDetalhes.vendasDevolucoesDetalhes);
      state.dbVendaDetalhesGrafico = props.dbVendasDetalhes.vendasGraficoDetalhes;
    }
  }
);

const dadosVendasToGrafico = computed(() => {
  const cabecalho = [];
  const dados = [];

  if (state.dbVendaDetalhesGrafico.length > 0) {
    state.dbVendaDetalhesGrafico.forEach((item) => {
      cabecalho.push(item.DIA);
      dados.push(item.VALOR);
    });
  }

  return {
    labels: cabecalho,
    series: dados,
  };
});

const state = reactive({
  gridDevolucoes: <ixGridCreate>{},

  dbVendaDetalhesGrafico: <iVendaGraficoDetalhes[]>[],
});

const actions = {
  criarGrid() {
    state.gridDevolucoes = new xGridV2.create({
      el: "#gridDevolucoes",
      width: 950,
      height: 300,
      count: false,
      columns: {
        "N° Orçamento": { dataField: "NUM_ORCAMENTO" },
        Cliente: { dataField: "NOME", width: "45%" },
        "Data Venda": { dataField: "DATA_VENDA", render: utils.dataBrasil, center: true },
        "Data Dev.": { dataField: "DATA", render: utils.dataBrasil, center: true },
        Desconto: { dataField: "DESCONTO", render: utils.formatValor, right: true },
        Valor: { dataField: "VALOR", render: utils.formatValor, right: true },
        "Valor Orç.": { dataField: "VALOR_ORCAMENTO", render: utils.formatValor, right: true },
        "Valor Mont.": { dataField: "VALOR_MONTAGEM", render: utils.formatValor, right: true },
      },
    });
  },
};

nextTick(() => {
  actions.criarGrid();
});
</script>

<template>
  <v-container>
    <div>
      <span>Devolução</span>
      <div id="gridDevolucoes"> </div>
    </div>
    <div class="pt-5">
      <span>Gráfico de Venda</span>

      <VueApexCharts
        width="100%"
        height="296"
        type="bar"
        :options="{
        chart: {
          id: 'basic-bar',
        },
        xaxis: {
          categories: dadosVendasToGrafico.labels,
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
            data: dadosVendasToGrafico.series,
          },
        ]"
      />
    </div>
  </v-container>
</template>
