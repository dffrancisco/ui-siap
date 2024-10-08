<script setup lang="ts">
import { actions, state } from "./bancos";
import { onMounted, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import bancosSearch from "./components/bancosSearch.vue";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    document.getElementById("edtSearch").focus(); 
    event.preventDefault();
    event.stopPropagation();
  }
});

onMounted(async () => {  
  actions.init()
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Gerenciar Bancos</title>
    <v-card width="700" class="pa-5 ma-auto">
      <div id="pnCampos">
        <v-row>
          <v-col cols="7">
            <span>Nome Banco</span>
            <input
              v-model="state.dbBanco.DS_BANCO"
              type="text"
              id="DS_BANCO"
              name="DS_BANCO"
              class="obr ss"
              maxlength="51"
              autocomplete="off"
            />
          </v-col>

          <v-col>
            <span>Código Banco</span>
            <input
              v-model="state.dbBanco.CD_BANCO"
              type="text"
              id="CD_BANCO" 
              name="CD_BANCO"
              v-mask="'#####'"
              class="obr ss"
              maxlength="5"
              autocomplete="off"
            />
          </v-col>

          <v-col>
            <span>Sigla Banco</span>
            <input
              v-model="state.dbBanco.SG_BANCO"
              type="text"
              id="SG_BANCO"
              name="SG_BANCO"
              class="obr ss"
              maxlength="22"
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <div class="mt-2 d-flex ga-2">
          <input
            v-model="state.edtSearch"  
            type="text"
            placeholder="F1 - Buscar"
            :disabled="state.pnSearch"
            @keydown.enter.prevent="actions.search()"
            @keydown.arrow-down="state.gridPrincipal.focus(0)"
            id="edtSearch"
            class="ss"
          />

          <v-btn
            :disabled="state.pnSearch"
            size="30"
            color="primary"
            @click="actions.search()"
            icon="mdi-magnify"
          />
        </div>
      </div>

      <v-overlay
        :model-value="state.loading"
        class="align-center justify-center"
        persistent
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="50"
        ></v-progress-circular>
      </v-overlay>

      <div id="gridPrincipal" class="mt-2"></div>

      <div id="pnBotoes" class="mt-2" style="text-align: center"></div>

    </v-card>

    <div id="pnCodigoTela">Bancos</div>
  </v-container>
</template>

<style scoped>
</style>
