<script setup lang="ts">
import { onMounted } from "vue";
import { state, actions } from "./equalizaPrecoLojas";
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";

onMounted(async () => {
  await actions.init();
});
</script>

<template>
  <v-container fluid>
    <v-card
      :max-width="1100"
      class="mx-auto pa-4"
    >
      <v-row>
        <v-col cols="5">
          <div class="d-flex ga-2 pa-2">
            <v-text-field
              label="Filtrar Loja ou Nº Nota (F1)"
              :clearable="false"
              v-model="state.filtroNota"
              id="inputFiltroNota"
              width="300px"
              density="compact"
              append-inner-icon="mdi-magnify"
              ref="inputSearch"
              autocomplete="off"
              @keydown.enter.prevent="actions.searchNota"
              @keydown.arrow.down.prevent="state.xgNotas.focus()"
            ></v-text-field>
          </div>
        </v-col>

        <v-col cols="7">
          <div class="d-flex ga-2 pa-2">
            <v-text-field
              label="Filtrar Item da Nota (F2)"
              :clearable="false"
              v-model="state.filtroItemNota"
              id="inputFiltroItensNota"
              width="300px"
              autocomplete="off"
              density="compact"
              append-inner-icon="mdi-magnify"
              ref="inputSearch"
              @keydown.enter.prevent="actions.searchItemNota"
              @keydown.arrow.down.prevent="state.xgItensNotas.focus()"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="5"
          class="pa-2"
        >
          <v-card title="Notas Fiscais">
            <v-divider></v-divider>
            <div id="xgNotas"></div>
          </v-card>
        </v-col>

        <v-col
          cols="7"
          class="pl-2 pa-2"
        >
          <v-card title="Itens da Nota">
            <v-divider></v-divider>
            <div id="xgItensNotas"></div>
          </v-card>

          <div class="d-flex justify-end ga-2 pt-3">
            <v-btn
              @click="actions.imprimir"
              :disabled="state.dbItensNota.length === 0"
              icon="mdi-printer"
              color="primary"
              size="36px"
              title="Imprimir"
            >
              <v-icon left>mdi-printer</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              @click="actions.atualizar"
              :disabled="state.dbItensNota.length === 0"
            >
              Atualizar
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <modalXAuthManager :retain-focus="false" />

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

.v-overlay__scrim {
  background-color: black;
}
</style>

<style scoped>
.v-col {
  padding: 0;
}
</style>
