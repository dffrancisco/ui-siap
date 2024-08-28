<script setup lang="ts">
import { onMounted } from "vue";
import { actions } from "./faturarCliente";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      width="800"
      height="550"
      class="ma-auto pa-4 d-flex flex-column"
    >
      <div>
        <v-row class="align-start">
          <v-col cols="3">
            <v-text-field
              type="date"
              label="Data limite"
              :hide-spin-buttons="true"
              :clearable="false"
              density="compact"
            />
          </v-col>
          <v-col class="d-flex ga-4">
            <v-text-field
              type="text"
              label="Cliente"
              density="compact"
              disabled
            />
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-magnify"
                size="34"
                color="primary"
              />
            </div>
          </v-col>
        </v-row>
      </div>

      <div
        class="mt-4 d-flex"
        style="height: 380px"
      >
        <v-row>
          <v-col
            cols="9"
            class="d-flex"
          >
            <div id="gridPedido"></div>
          </v-col>
          <v-col class="d-flex">
            <div class="border rounded-lg d-flex flex-grow-1 flex-column justify-space-between pa-3">
              <div class="custom-scroll">
                <div
                  v-for="i in 3"
                  class="d-flex justify-space-between"
                >
                  <span class="text-body-1">+123</span>
                  <span
                    class="text-body-1"
                    style="color: #60a5fa"
                    >200,00</span
                  >
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-body-1">D123</span>
                  <span
                    class="text-body-1"
                    style="color: #f87171"
                    >200,00</span
                  >
                </div>
              </div>
              <div class="d-flex flex-column">
                <span class="text-body-2"><strong>Qtd. Orç: </strong>3</span>
                <span class="text-body-2"><strong>Somatório: </strong>600,00</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <div class="d-flex mt-4 flex-grow-1">
        <v-row>
          <v-col
            cols="9"
            class="d-flex flex-grow-1"
          >
            <div class="border rounded-lg d-flex flex-grow-1 justify-space-between pa-4">
              <div class="d-flex ga-10">
                <div class="d-flex flex-column align-end">
                  <span class="text-body-2"><strong>Qtd. Orç:</strong></span>
                  <span class="text-body-2">10</span>
                </div>
                <div class="d-flex flex-column align-end">
                  <span class="text-body-2"><strong>Total Orç:</strong></span>
                  <span class="text-body-2">2.500,00</span>
                </div>
              </div>
              <div>
                <v-btn color="error">faturar (f1)</v-btn>
              </div>
            </div>
          </v-col>
          <v-col class="d-flex align-end">
            <div class="d-flex flex-grow-1">
              <v-text-field
                label="Localizar"
                density="compact"
              />
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <div id="pnCodigoTela">faturarCliente</div>
  </v-container>
</template>

<style scoped>
.custom-scroll {
  padding-right: 10px;
  overflow: auto;
  height: 300px;
  scrollbar-width: thin;
}
</style>
