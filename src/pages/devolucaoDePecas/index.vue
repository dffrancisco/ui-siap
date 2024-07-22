<script setup lang="ts">
import { nextTick } from "vue";
import { actions, dataHoje, state } from "./devolucaoDePecas";

nextTick(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card class="pa-5 main-card">
      <div class="d-flex justify-end align-end ga-4 pb-4">
        <div class="container-data">
          <span>Data Inicial</span>
          <input
            type="date"
            class="ss obr"
            v-model="state.dataInicio"
            :max="dataHoje"
            maxlength="10"
            @keyup.enter="state.inputElementDataFim.focus()"
          />
        </div>

        <div class="container-data">
          <span>Data Final</span>
          <input
            type="date"
            class="ss obr"
            id="DATA_FIM"
            v-model="state.dataFim"
            :max="dataHoje"
            maxlength="10"
            @keyup.enter="actions.buscarDevolucoes"
          />
        </div>
        <v-btn
          icon="mdi-magnify"
          color="primary"
          size="36"
          @click="actions.buscarDevolucoes"
        />
      </div>

      <v-data-table
        :headers="state.headers"
        :items="state.dbDevolucoes"
        items-per-page-text="Itens por página"
        no-data-text="Não há dados disponíveis"
        height="480"
        items-per-page="50"
        fixed-header
        class="pb-4"
        :row-props="actions.getClassCorLinha"
      >
        <template v-slot:item.NF_DEVOLUCAO="{ item }">
          <div class="nf-container">{{ item.NF_DEVOLUCAO }}</div>
        </template>
      </v-data-table>

      <div class="d-flex justify-space-between align-center">
        <span class="text-subtitle-1">
          Valor do Crédito igual a 0,00 (zero) significa que o cliente já usou o crédito
        </span>
        <v-btn
          icon="mdi-printer"
          color="primary"
          size="36"
          title="IMPRIMIR"
          :disabled="state.dbDevolucoes.length == 0"
          @click="actions.onClickImprimir"
        />
      </div>
    </v-card>

    <div id="pnCodigoTela">devolucaoDePecas</div>
  </v-container>

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
</template>

<style>
.cor-zebrada {
  background-color: #f5f5f5;
}

.nf-container {
  word-wrap: break-word;
  white-space: normal;
  width: 130px;
}
</style>

<style scoped>
.main-card {
  margin: 0 auto;
  width: 1000px;
}

.container-data {
  width: 140px;
}
</style>
