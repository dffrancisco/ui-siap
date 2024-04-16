<script setup lang="ts">
import moment from "moment";
import {
  state,
  actions,
  vendasOrdenadas,
  dadosToPrint,
  dadosVendasPorDiaToGrafico,
  dadosVendasPorHoraToGrafico,
} from "./vendaPorVendedor";
import printJS from "print-js";
import { nextTick } from "vue";
import VueApexCharts from "vue3-apexcharts";
import utils from "@/ts/utils";

nextTick(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card class="pa-5 cardContainer">
      <div class="inputs pb-5">
        <div class="inputData">
          <span>Data Inicial</span>
          <input
            v-model="state.dataInicial"
            id="DATA_INICIAL"
            name="DATA_INICIAL"
            type="date"
            class="ss obr"
            :max="moment().format('YYYY-MM-DD')"
            @keydown.enter="state.inputDataFinal.focus()"
          />
        </div>
        <div class="inputData">
          <span>Data Final</span>
          <input
            v-model="state.dataFinal"
            id="DATA_FINAL"
            name="DATA_FINAL"
            type="date"
            class="ss obr"
            :max="moment().format('YYYY-MM-DD')"
            @keydown.enter.prevent="actions.pesquisarVendas"
          />
        </div>
        <div>
          <v-btn
            color="primary"
            icon="mdi-magnify mdi-24px"
            size="40"
            @click="actions.pesquisarVendas"
          >
          </v-btn>
        </div>
        <div>
          <v-btn
            :disabled="state.dbVendas.length <= 0"
            color="primary"
            icon="mdi-printer mdi-24px"
            size="40"
            @click="
              printJS({
                printable: dadosToPrint,
                properties: [
                  { field: 'LOGIN', displayName: 'Vendedor' },
                  { field: 'LIMITE', displayName: 'Limite Crédito' },
                  { field: 'VALOR_VENDA', displayName: 'Venda' },
                  { field: 'VALOR_DEVOLUCAO', displayName: 'Devolução' },
                  { field: 'VENDA_LIQUIDA', displayName: 'Ved.Líquida' },
                  { field: 'TICKET_MEDIO', displayName: 'Ticket Médio' },
                  { field: 'QTD_MEDIA_ITENS', displayName: 'Qtd.Média Itens' },
                ],
                type: 'json',
                gridHeaderStyle: 'border: 1px solid #000000',
                gridStyle: 'text-align: center; border: 1px solid #000000',
              })
            "
          >
          </v-btn>
        </div>
      </div>

      <v-data-table
        :headers="state.headers"
        :items="vendasOrdenadas"
        style="text-transform: none"
        items-per-page-text="Itens por página"
        no-data-text="Não há dados disponíveis"
        class="ss"
        height="558"
      >
        <template v-slot:item.VALOR_DEVOLUCAO="{ value }">
          <spam style="color: #bf3f3f"> -{{ value }} </spam>
        </template>
        <template v-slot:item.inf="{ item }">
          <v-icon
            v-if="item.COD_FUNCIONARIO != null"
            size="large"
            color="primary"
            @click="console.log('abrir modal')"
          >
            mdi-information
          </v-icon>
        </template>
      </v-data-table>

      <div
        class="pt-5"
        v-if="state.dbVendas.length > 0"
      >
        <span>Gráfico de Venda por Dia</span>

        <VueApexCharts
          width="100%"
          height="350"
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
      }"
          :series="[
            {
              name: 'Venda do Dia',
              data: dadosVendasPorDiaToGrafico.series,
            },
          ]"
        />
      </div>

      <div
        class="pt-5"
        v-if="state.dbVendas.length > 0"
      >
        <span>Gráfico de Venda por Hora</span>

        <VueApexCharts
          width="100%"
          height="350"
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
    </v-card>

    <div id="pnCodigoTela">VENDA_POR_VENDEDOR</div>
  </v-container>
</template>

<style scoped>
.inputs {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 26px;
}

.inputData {
  width: 140px;
}

.cardContainer {
  width: 900px;
  margin: 0 auto;
}
</style>
