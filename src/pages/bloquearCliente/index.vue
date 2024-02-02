<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions } from "./bloquearCliente";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <title>Bloquear Cliente</title>
    <v-card
      class="pa-5"
      style="width: 700px; margin: 0 auto"
    >
      <div class="pb-2">
        <v-row>
          <v-col cols="3">
            <span>CNPJ</span>
            <input
              type="button"
              v-model="state.dbClienteSelecionado.CGC_CLIENTE"
              class="ss"
              name="CGC_CLIENTE"
              id="CGC_CLIENTE"
              @click="actions.modalClienteOpen"
            />
          </v-col>
          <v-col cols="8">
            <span>Razão Social</span>
            <input
              type="button"
              v-model="state.dbClienteSelecionado.NOME"
              class="ss"
              name="NOME"
              id="NOME"
              @click="actions.modalClienteOpen"
            />
          </v-col>
          <v-btn
            style="margin-top: 20px"
            icon="mdi-magnify"
            color="blue"
            size="small"
            @click="actions.modalClienteOpen"
          >
          </v-btn>
        </v-row>
      </div>

      <div id="pnBloqueioCliente"></div>

      <v-overlay
        :model-value="state.loading"
        class="align-center justify-center"
        persistent
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        >
        </v-progress-circular>
      </v-overlay>

      <div id="pnCodigoTela">BLOQUEAR_CLIENTE</div>
    </v-card>
  </v-container>
</template>
