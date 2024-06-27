<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions } from "./historicoConsultaLojas";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      class="pa-5"
      style="width: 876px; margin: 0 auto"
    >
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

    <div id="pnCodigoTela">VENDA_PERDIDA</div>
  </v-container>
</template>

<style></style>

<style scoped></style>
