<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions, computeds } from "./whatsappPerformance";
import VueApexCharts from "vue3-apexcharts";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container style="width: 1100px">
    <div class="mb-2">
      <v-btn
        color="primary"
        variant="outlined"
        class="mr-2"
        @click="actions.redirectToWhatsapp()"
      >
        <v-icon class="mr-1">mdi-clock</v-icon>
        Tempo real
      </v-btn>
      <v-btn color="primary">
        <v-icon>mdi-chart-areaspline</v-icon>
        Performance
      </v-btn>
    </div>
    <v-card class="pa-3">
      <v-row>
        <v-col cols="3">
          <v-text-field
            type="date"
            label="Data Início"
            hide-details
            :clearable="false"
            v-model="state.edtDataInicio"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            type="date"
            label="Data Fim"
            hide-details
            :clearable="false"
            v-model="state.edtDataFim"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-btn
            @click="actions.buscarDados"
            color="primary"
            >buscar</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
    <div>
      <v-row class="py-2">
        <v-col cols="4">
          <div>
            <v-card class="py-2">
              <VueApexCharts
                type="pie"
                height="250"
                :options="{
                  title: {
                    text: 'Quantidade de Atendimentos por Estado',
                  },
                  chart: {
                    type: 'pie',
                  },
                  labels: computeds.qtdAtendimentoOrdenado.value.labels,
                  legend: {
                    position: 'bottom',
                  },
                }"
                :series="computeds.qtdAtendimentoOrdenado.value.series"
              />
            </v-card>
          </div>
        </v-col>
        <v-col cols="8">
          <v-row>
            <v-col>
              <div class="d-flex flex-column ga-2">
                <div>
                  <v-card>
                    <v-card-text class="d-flex flex-column align-center">
                      <strong>{{ computeds.totalizadores.value.totalGeral }}</strong>
                      <span>Total Conversas</span>
                    </v-card-text>
                  </v-card>
                </div>
                <div>
                  <v-card>
                    <v-card-text class="d-flex flex-column align-center">
                      <strong>{{ computeds.totalizadores.value.recebida }}</strong>
                      <span>Conversas Recebidas</span>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-col>
            <v-col>
              <div class="d-flex flex-column ga-2">
                <div>
                  <v-card>
                    <v-card-text class="d-flex flex-column align-center">
                      <strong>{{ computeds.totalizadores.value.enviada }}</strong>
                      <span>Conversas Enviadas</span>
                    </v-card-text>
                  </v-card>
                </div>
                <div>
                  <v-card>
                    <v-card-text class="d-flex flex-column align-center">
                      <strong>{{ state.totalizadores.qtdAds }}</strong>
                      <span>ADS (Tráfego Pago)</span>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-col>
          </v-row>
          <div class="mt-2 d-flex justify-center">
            <v-card>
              <v-card-text class="d-flex flex-column align-center">
                <strong>{{ computeds.tempoMedioFormatado.value }}</strong>
                <span>Tempo Médio de Atendimento</span>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-card class="pt-2">
      <div
        class="d-flex"
        style="gap: 8px"
      >
        <div style="width: 100%">
          <VueApexCharts
            width="100%"
            height="500"
            :plotOptions="{
              bar: {
                horizontal: true,
              },
            }"
            :options="{
              title: {
                text: 'Atendimentos Iniciados',
              },
              chart: {
                type: 'bar',
                id: 'basic-bar',
                stacked: true,
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                },
              },
              xaxis: {
                categories: computeds.chartEmAndamento.value.labels,
              },
              dataLabels: {
                enabled: true,
              },
            }"
            :series="[
              {
                name: 'Qtd. Recebida',
                data: computeds.chartEmAndamento.value.series.qtdRecebida,
              },
              {
                name: 'Qtd. Enviada',
                data: computeds.chartEmAndamento.value.series.qtdEnviada,
              },
            ]"
          />
        </div>
        <div style="width: 100%">
          <VueApexCharts
            width="100%"
            height="500"
            :plotOptions="{
              bar: {
                horizontal: true,
              },
            }"
            :options="{
              title: {
                text: 'Atendimentos Finalizados',
              },
              chart: {
                type: 'bar',
                id: 'basic-bar',
                stacked: true,
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                },
              },
              xaxis: {
                categories: computeds.chartFinalizado.value.labels,
              },
              dataLabels: {
                enabled: true,
              },
            }"
            :series="[
              {
                name: 'Qtd. Recebida',
                data: computeds.chartFinalizado.value.series.qtdRecebida,
              },
              {
                name: 'Qtd. Enviada',
                data: computeds.chartFinalizado.value.series.qtdEnviada,
              },
            ]"
          />
        </div>
      </div>
    </v-card>
    <div id="pnCodigoTela">whatsappPerformance</div>
  </v-container>
</template>

<style scoped lang="scss"></style>
