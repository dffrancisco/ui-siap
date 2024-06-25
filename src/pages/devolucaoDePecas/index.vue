<script setup lang="ts">
import { nextTick } from "vue";
import { actions, dataHoje, state } from "./devolucaoDePecas";
import utils from "@/ts/utils";

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
            @keyup.enter="state.inputElementDataFim.focus"
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
      >
        <template v-slot:item="{ item, index }">
          <tr :style="{ backgroundColor: index % 2 === 0 ? '#fff' : '#f2f2f2', textAlign: 'end' }">
            <td style="text-align: center">{{ item.NUM_DEVOLUCAO }}</td>
            <td style="text-align: center">{{ item.NUM_ORCAMENTO }}</td>
            <td style="text-align: center">{{ utils.dataBrasil(item.DATA) }}</td>
            <td>{{ utils.formatValor(item.VALOR) }}</td>
            <td>{{ item.CREDITO != null ? utils.formatValor(item.CREDITO) : null }}</td>
            <td style="text-align: start">{{ item.LOGIN }}</td>
            <td style="text-align: center">{{ item.STATUS }}</td>
          </tr>
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

<style scoped>
.main-card {
  margin: 0 auto;
  width: 850px;
}

.container-data {
  width: 140px;
}
</style>
