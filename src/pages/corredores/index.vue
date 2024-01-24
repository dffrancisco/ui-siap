<script setup lang="ts">
import { nextTick } from "vue";
import corredorSearch from './components/corredorSearch.vue'
import { actions, state } from "./corredores";

nextTick(async () => {
 actions.init()
});
</script>

<template>
  <V-container>
    <title>Corredores</title>
    <v-card class="pa-5" style="width: 700px; margin: 0 auto">
      <div id="pnCampos">
        <v-row>
          <v-col cols="6">
            <span>Descrição</span>
            <input
              v-model="state.dbCorredor.DESCRICAO"
              id="DESCRICAO"
              name="DESCRICAO"
              type="text"
              class="obr ss"
            />
          </v-col>
          <v-col cols="6">
            <span>Localidade</span>
            <input
              v-model="state.dbCorredor.LOCALIDADE"
              id="LOCALIDADE"
              name="LOCALIDADE"
              type="text"
              class="obr ss"
            />
          </v-col>
        </v-row>
      </div>

      <corredorSearch />

      <div id="gridPrincipal"></div>
      <div id="pnBotoes" class="mt-3" style="text-align: center"></div>

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
  </V-container>
</template>
<style></style>