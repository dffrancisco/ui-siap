<script setup lang="ts">
import { onMounted } from "vue";
import { actions, dataHoje, state } from "./vendaPorCategoria";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card class="pa-5 card-principal d-flex flex-column ga-2">
      <div class="d-flex justify-end align-end ga-4">
        <div class="input-data-container">
          <span>Data Inicial</span>
          <input
            type="date"
            v-model="state.dataInicial"
            class="ss obr"
            id="DATA_INICIO"
            maxlength="10"
            :max="dataHoje"
            @keydown.enter="state.inputElementDataFinal.focus()"
          />
        </div>

        <div class="input-data-container">
          <span>Data Final</span>
          <input
            type="date"
            v-model="state.dataFinal"
            class="ss obr input-date"
            id="DATA_FIM"
            maxlength="10"
            :max="dataHoje"
          />
        </div>

        <v-btn
          icon="mdi-magnify"
          color="primary"
          size="36px"
          title="Pesquisar"
        />

        <v-btn
          icon="mdi-printer"
          color="primary"
          size="36px"
          title="Imprimir"
        />
      </div>

      <v-data-table height="480"></v-data-table>

      <div id="pnCodigoTela">vendaPorCategoria</div>

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

<style scoped>
.card-principal {
  margin: 0 auto;
  width: 800px;
}

.input-data-container {
  width: 130px;
}
</style>
