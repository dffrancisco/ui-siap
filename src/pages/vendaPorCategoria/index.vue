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
      <div class="d-flex justify-end align-center ga-4">
        <div>
          <v-text-field
            type="date"
            v-model="state.dataInicial"
            class="obr rounded-lg"
            id="DATA_INICIO"
            maxlength="10"
            :max="dataHoje"
            density="compact"
            @keydown.enter="state.inputElementDataFinal.focus()"
          />
        </div>

        <div>
          <v-text-field
            type="date"
            v-model="state.dataFinal"
            class="obr rounded-lg"
            id="DATA_FIM"
            maxlength="10"
            :max="dataHoje"
            density="compact"
            @keydown.enter.prevent="actions.btnPesquisar"
          />
        </div>

        <v-select density="compact"></v-select>

        <v-btn
          icon="mdi-magnify"
          color="primary"
          size="36px"
          title="Pesquisar"
          @click="actions.btnPesquisar"
        />

        <v-btn
          icon="mdi-printer"
          color="primary"
          size="36px"
          title="Imprimir"
        />
      </div>

      <v-data-table
        height="480"
        :headers="state.headers"
        fixed-header
      ></v-data-table>

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
