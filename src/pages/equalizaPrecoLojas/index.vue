<!-- equalizaPrecoLojas/index.vue -->
<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions } from "./equalizaPrecoLojas";
import utils from "@/ts/utils";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container fluid>
    <v-card
      :max-width="1200"
      class="mx-auto pa-4"
    >
      <v-row>
        <v-col cols="5">
          <v-card
            title="Notas Fiscais"
            class="mb-4"
          >
            <v-divider></v-divider>
            <v-data-table-virtual
              :headers="state.headersNotas"
              :items="state.notas"
              item-value="ID_ENTRADA"
              @click:row="actions.selecionarNota"
              item-index="index"
              fixed-header
              class="elevation-1"
              :row-props="actions.getClassCorLinha"
              height="450"
            >
              <template v-slot:item.DATA="{ item }">
                {{ utils.dataBrasil(item.DATA) }}
              </template>
            </v-data-table-virtual>
          </v-card>
        </v-col>

        <v-col
          cols="7"
          class="pl-4"
        >
          <v-card
            title="Itens da Nota"
            class="mb-4"
          >
            <v-divider></v-divider>
            <v-data-table-virtual
              :headers="state.headersItens"
              :items="state.itensNota"
              item-value="COD_PRODUTO"
              fixed-header
              item-index="index"
              class="elevation-1"
              :row-props="actions.getClassCorLinha"
              @click:row="(event, { item, index }) => (state.linhaSelecionadaItens = index)"
              height="450"
            >
              <template v-slot:item.CUSTO_N="{ item }">
                <div class="d-flex align-center">
                  <span>{{ utils.formatValor(item.CUSTO) }}</span>
                  <v-icon
                    color="grey lighten-1"
                    class="mx-2"
                    >mdi-arrow-left</v-icon
                  >
                  <span :class="{ 'text-blue': true }">{{ utils.formatValor(item.CUSTO_N) }}</span>
                  <v-icon
                    v-if="item.CUSTO > item.CUSTO_N"
                    color="green"
                    class="ml-1"
                    >mdi-arrow-down</v-icon
                  >
                  <v-icon
                    v-else-if="item.CUSTO < item.CUSTO_N"
                    color="red"
                    class="ml-1"
                    >mdi-arrow-up</v-icon
                  >
                  <v-icon
                    v-else
                    color="blue lighten-3"
                    class="ml-1"
                    >mdi-circle</v-icon
                  >
                </div>
              </template>

              <template v-slot:item.VENDA_N="{ item }">
                <div class="d-flex align-center">
                  <span>{{ utils.formatValor(item.VENDA) }}</span>
                  <v-icon
                    color="grey lighten-1"
                    class="mx-2"
                    >mdi-arrow-left</v-icon
                  >
                  <span :class="{ 'text-blue': true }">{{ utils.formatValor(item.VENDA_N) }}</span>
                  <v-icon
                    v-if="item.VENDA > item.VENDA_N"
                    color="green"
                    class="ml-1"
                    >mdi-arrow-down</v-icon
                  >
                  <v-icon
                    v-else-if="item.VENDA < item.VENDA_N"
                    color="red"
                    class="ml-1"
                    >mdi-arrow-up</v-icon
                  >
                  <v-icon
                    v-else
                    color="blue lighten-3"
                    class="ml-1"
                    >mdi-circle</v-icon
                  >
                </div>
              </template>
            </v-data-table-virtual>
          </v-card>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="actions.imprimir"
              class="mr-2"
              append-icon="mdi-printer"
              >Imprimir</v-btn
            >
            <v-btn
              color="primary"
              :disabled="!state.notaSelecionada"
            >
              Atualizar
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
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
    <div id="pnCodigoTela">equalizaPrecoLojas</div>
  </v-container>
</template>

<style>
.cor-zebrada-1 {
  background-color: #f0f0f0;
}

.linha-selecionada {
  background-color: #45b2ff !important;
  font-weight: 500;
}

.v-data-table__tr {
  cursor: pointer;
}

.v-data-table__tr:hover {
  background-color: #f5f5f5 !important;
}

.v-data-table__tr.linha-selecionada:hover {
  background-color: #bbdefb !important;
}

.v-overlay__scrim {
  background-color: black;
}
</style>

<style scoped>
.v-col {
  padding: 0;
}
</style>
