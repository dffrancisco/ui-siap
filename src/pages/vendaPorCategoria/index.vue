<script setup lang="ts">
import { onMounted } from "vue";
import { actions, dataHoje, state } from "./vendaPorCategoria";
import utils from "@/ts/utils";

onMounted(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card class="pa-5 card-principal d-flex flex-column">
      <v-row class="d-flex align-center justify-space-between">
        <v-col cols="3">
          <v-text-field
            type="date"
            label="Data Inicial"
            v-model="state.dataInicial"
            id="DATA_INICIO"
            maxlength="10"
            :max="dataHoje"
            density="compact"
            @keydown.enter="state.inputElementDataFinal.focus()"
          />
        </v-col>

        <v-col cols="3">
          <v-text-field
            type="date"
            label="Data Final"
            v-model="state.dataFinal"
            id="DATA_FIM"
            maxlength="10"
            :max="dataHoje"
            density="compact"
            @keydown.enter="state.selectElementCategoria.focus()"
          />
        </v-col>

        <v-col cols="3">
          <v-select
            v-model="state.selectCategoria"
            density="compact"
            label="Categoria"
            id="CATEGORIA"
            item-title="DESCRICAO"
            item-value="ID_MARCA_GRUPO"
            :items="state.listaMarcasGrupos"
            :clearable="false"
          />
        </v-col>

        <v-col
          cols="1"
          class="d-flex justify-center"
        >
          <v-btn
            icon="mdi-magnify"
            color="primary"
            size="40px"
            title="Pesquisar"
            @click="actions.btnPesquisar"
          />
        </v-col>

        <v-col
          cols="1"
          class="d-flex justify-center"
        >
          <v-btn
            icon="mdi-printer"
            color="primary"
            size="40px"
            title="Imprimir"
          />
        </v-col>
      </v-row>

      <v-data-table
        height="500"
        class="pt-4"
        :headers="state.headers"
        fixed-header
        :items="state.dbVendaPorCategoria"
        items-per-page="0"
        :row-props="actions.getClassCorLinha"
      >
        <template #bottom></template>
        <template
          v-slot:item.VALOR="{ item }"
          style=""
        >
          {{ utils.formatValor(item.VALOR) }}
        </template>
      </v-data-table>

      <div
        id="pnCodigoTela"
        class="pt-4"
        >vendaPorCategoria</div
      >
    </v-card>
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
.card-principal {
  margin: 0 auto;
  width: 850px;
}

.input-data-container {
  width: 130px;
}
</style>

<style>
.cor-zebrada-1 {
  background-color: #e5e7eb;
}
</style>
