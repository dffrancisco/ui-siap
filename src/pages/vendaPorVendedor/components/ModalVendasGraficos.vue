<script setup lang="ts">
import utils from "@/ts/utils";
import { computed, reactive, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { iVendaPorDiaGrafico, iVendaPorHoraGrafico, iParamGetVendasGraficos } from "../interfaces";
import Swal from "sweetalert2";
import serviceVendasPorVendedor from "../services/vendaPorVendedor.service";

const props = defineProps<{
  modalOpened: boolean;
  dataInicial?: string;
  dataFinal?: string;
}>();

watch(
  () => props.modalOpened,
  async () => {
    if (props.modalOpened) {
      await actions.getVendasGraficos();
    }
  }
);

const dadosVendasPorDiaToGrafico = computed(() => {
  const cabecalho = [];
  const dados = [];

  if (state.dbVendasPorDiaGrafico.length > 0) {
    state.dbVendasPorDiaGrafico.forEach((item) => {
      cabecalho.push(item.DIA);
      dados.push(item.VALOR);
    });
  }

  return {
    labels: cabecalho,
    series: dados,
  };
});

const dadosVendasPorHoraToGrafico = computed(() => {
  const cabecalho = [];
  const dados = [];

  if (state.dbVendasPorHoraGrafico.length > 0) {
    state.dbVendasPorHoraGrafico.forEach((item) => {
      cabecalho.push(item.HORA);
      dados.push(item.VALOR);
    });
  }

  return {
    labels: cabecalho,
    series: dados,
  };
});

const state = reactive({
  dbVendasPorDiaGrafico: <iVendaPorDiaGrafico[]>[],
  dbVendasPorHoraGrafico: <iVendaPorHoraGrafico[]>[],

  loading: false,
});

const actions = {
  async getVendasGraficos() {
    try {
      let param: iParamGetVendasGraficos = {
        DATA_INICIO: props.dataInicial,
        DATA_FIM: props.dataFinal,
      };

      state.loading = true;

      let data = await serviceVendasPorVendedor.getVendasGraficos(param);

      state.dbVendasPorDiaGrafico = data.vendasPorDiaGrafico;
      state.dbVendasPorHoraGrafico = data.vendasPorHoraGrafico;

      state.loading = false;
    } catch (error) {
      state.loading = false;
      Swal.fire({
        icon: "error",
        title: "Erro ao exibir os gráficos!",
      });
    }
  },
};
</script>

<template>
  <v-container>
    <div>
      <span>Gráfico de Venda por Dia</span>

      <VueApexCharts
        width="100%"
        height="246"
        type="bar"
        :options="{
            chart: {
            id: 'basic-bar',
            },
            xaxis: {
            categories: dadosVendasPorDiaToGrafico.labels,
            },
            yaxis: {
            labels: {
                formatter: (value: number) => utils.formatValor(value),
            },
            },
            dataLabels: {
              enabled: false,
            }
        }"
        :series="[
          {
            name: 'Venda do Dia',
            data: dadosVendasPorDiaToGrafico.series,
          },
        ]"
      />
    </div>

    <div class="pt-5">
      <span>Gráfico de Venda por Hora</span>

      <VueApexCharts
        width="100%"
        height="246"
        type="line"
        :options="{
            chart: {
            id: 'basic-bar',
            },
            xaxis: {
            categories: dadosVendasPorHoraToGrafico.labels,
            },
            yaxis: {
            labels: {
                formatter: (value: number) => utils.formatValor(value),
            },
            },
        }"
        :series="[
          {
            name: 'Venda por Hora',
            data: dadosVendasPorHoraToGrafico.series,
          },
        ]"
      />
    </div>

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
