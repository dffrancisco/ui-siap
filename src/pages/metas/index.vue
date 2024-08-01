<script setup lang="ts">
import { onMounted } from "vue";
import { actions, computeds, state } from "./metas";
import utils from "@/ts/utils";
import MetaCard from "./components/MetaCard.vue";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <title>Metas</title>
  <v-container>
    <v-card class="pa-4 main-card">
      <div class="d-flex justify-space-between align-center flex-grow-1">
        <div class="d-flex flex-grow-1">
          <v-radio-group
            class="ml-4"
            hide-details
            v-if="1 + 1 == 2"
          >
            <v-row>
              <v-col cols="2">
                <v-radio
                  label="Geral"
                  value="0"
                />
              </v-col>
              <v-col cols="2">
                <v-radio
                  label="Diurna"
                  value="1"
                />
              </v-col>
              <v-col>
                <v-radio
                  label="Noturna"
                  value="2"
                />
              </v-col>
            </v-row>
          </v-radio-group>
        </div>
        <div class="d-flex ga-4 align-center">
          <v-text-field
            v-model="state.data"
            type="date"
            label="Data"
            :clearable="false"
            style="width: fit-content"
            @keydown.enter.prevent="actions.btnPesquisarMetas"
          ></v-text-field>
          <v-btn
            size="36"
            icon="mdi-magnify"
            color="primary"
            @click="actions.btnPesquisarMetas"
          />
          <v-icon
            size="36"
            color="primary"
            >mdi-eye</v-icon
          >
        </div>
      </div>

      <div class="d-flex flex-column ga-2">
        <div class="text-h6"> Metas: </div>
        <div class="d-flex justify-space-between">
          <MetaCard
            v-for="dados in computeds.dadosToMetaCardGeral.value"
            :dadosToMetaCard="dados"
          />
        </div>
      </div>

      <v-divider />

      <div class="d-flex flex-column ga-2">
        <div class="text-h6">Previsão:</div>
        <div>
          <v-card>
            <v-table>
              <thead>
                <tr style="background-color: #e5e7eb">
                  <th> Média Venda </th>
                  <th> Desejado </th>
                  <th> Privisão % </th>
                  <th> Previsão $ </th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #f9fafb">
                  <td style="border-right: 1px #e5e7eb solid">R$ 1.000,00</td>
                  <td>R$ 500,00</td>
                  <td>R$ 300,00</td>
                  <td>R$ 200,00</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>
      </div>
    </v-card>
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
    <div id="pnCodigoTela">metas</div>
  </v-container>
</template>

<style scoped>
.main-card {
  width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
