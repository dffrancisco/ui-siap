<script setup lang="ts">
import { onMounted } from "vue";
import { actions } from "./metas";

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
            type="date"
            label="Data"
            style="width: fit-content"
          ></v-text-field>
          <v-btn
            size="36"
            icon="mdi-magnify"
            color="primary"
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
          <v-card
            v-for="i in 5"
            class="d-flex flex-column pa-2 ga-2 justify-space-between"
            width="170"
            color="#DBEAFE"
            height="100"
          >
            <span
              class="text-body-1"
              style="color: #374151"
              >Meta Geral</span
            >
            <div class="d-flex justify-center">
              <strong class="text-h6">2.000.000,00</strong>
            </div>
            <v-progress-linear
              model-value="100"
              height="20"
              rounded
              color="#60A5FA"
              ><strong>100%</strong></v-progress-linear
            >
          </v-card>
        </div>
      </div>

      <v-divider />

      <div class="d-flex flex-column ga-2">
        <div class="text-h6">Venda Diária:</div>
        <div>
          <v-card>
            <v-table>
              <thead>
                <tr style="background-color: #e5e7eb">
                  <th>&nbsp</th>
                  <th> Venda Geral </th>
                  <th> Venda Mercado </th>
                  <th> Venda Montagem </th>
                  <th> Venda Mecânica </th>
                  <th> Ticket Médio </th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #f9fafb">
                  <td>Diária</td>
                  <td>R$ 1.000,00</td>
                  <td>R$ 500,00</td>
                  <td>R$ 300,00</td>
                  <td>R$ 200,00</td>
                  <td>R$ 250,00</td>
                </tr>
                <tr style="background-color: #f9fafb">
                  <td>Acumulada</td>
                  <td>R$ 1.200,00</td>
                  <td>R$ 600,00</td>
                  <td>R$ 400,00</td>
                  <td>R$ 300,00</td>
                  <td>R$ 300,00</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
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
