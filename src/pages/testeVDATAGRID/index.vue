<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import { actions } from "./testeVDataGrid";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <title>Cadastro de frutas</title>
    <v-card
      class="pa-5"
      style="width: 700px; margin: 0 auto"
    >
      <div id="pnCampos">
        <v-row>
          <v-col col="6">
            <input />
          </v-col>
          <v-col col="6"></v-col>
        </v-row>
        <div id="gridPrincipal"></div>
        <div
          id="pnBotoes"
          class="mt-3"
          style="text-align: center"
        ></div>
      </div>
    </v-card>
  </v-container>
</template>
