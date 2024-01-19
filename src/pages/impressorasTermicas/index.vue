<script setup lang="ts">
import { nextTick } from "vue";
import impressorasSearch from "./components/impressorasSearch.vue";
import { state, actions } from "./impressorasTermicas";

nextTick(async () => {
  actions.getDrivers();
  actions.grids();

  state.gridPrincipal.queryOpen({ IP: "", LOCAL: "" }, () => {
    state.gridPrincipal.focus();
  });
});
</script>

<template>
  <v-container>
    <title>Impressoras Térmicas</title>
    <v-card
      class="pa-5"
      style="width: 800px; margin: 0 auto"
    >
      <div id="pnCampos">
        <v-row>
          <v-col cols="4">
            <span>IP</span>
            <input
              v-model="state.dbImpressorasTermicas.IP"
              id="IP"
              name="IP"
              type="text"
              class="obr ss"
            />
          </v-col>
          <v-col cols="4">
            <span>Local de Instalação</span>
            <input
              v-model="state.dbImpressorasTermicas.LOCAL"
              id="LOCAL"
              name="LOCAL"
              type="text"
              class="obr ss"
            />
          </v-col>
          <v-col cols="4">
            <span>Carrossel</span>
            <select
              v-model="state.dbImpressorasTermicas.CARROSSEL"
              class="obr ss"
              name="CARROSSEL"
              id="CARROSSEL"
            >
              <option
                v-for="car in state.dsDriver"
                :value="car.CARROSSEL"
              >
                {{ car.CARROSSEL.trim() == 'S' ? 'Sim' : 'Não'}}
              </option>
            </select>
          </v-col>
          <v-col cols="3">
            <span>Situação</span>
            <select
              v-model="state.dbImpressorasTermicas.STATUS"
              class="obr ss"
              name="STATUS"
              id="STATUS"
            >
              <option
                v-for="statu in state.dsDriver"
                :value="statu.STATUS"
                >{{ statu.STATUS.trim() == 'AT' ? 'ATIVA' : 'INATIVA' }}</option
              >
            </select>
          </v-col>
          <v-col cols="3">
            <span>Porta</span>
            <input
              v-model="state.dbImpressorasTermicas.PORTA"
              name="PORTA"
              id="PORTA"
              type="text"
              class="obr ss"
            />
          </v-col>
          <v-col cols="3">
            <span>Modelo</span>
            <select
              class="obr ss"
              v-model="state.dbImpressorasTermicas.DRIVER"
              name="DRIVER"
              id="DRIVER"
            >
              <option
                v-for="drive in state.dsDriver"
                :value="drive.DRIVER"
                >{{ drive.DRIVER }}</option
              >
            </select>
          </v-col>
          <v-col cols="3">
            <span>Qtde. Impressões</span>
            <input
              v-model="state.dbImpressorasTermicas.QTO_IMP"
              name="QTO_IMP"
              id="QTO_IMP"
              disabled
              type="text"
              class="ss"
            />
          </v-col>
        </v-row>
      </div>

      <impressorasSearch />

      <div id="gridPrincipal"></div>
      <div
        id="pnBotoes"
        class="mt-3"
        style="text-align: center"
      ></div>

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
  </v-container>
</template>
