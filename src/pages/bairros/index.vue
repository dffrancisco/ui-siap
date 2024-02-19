<script setup lang="ts">
import { nextTick, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import {state, actions} from './bairros'

nextTick(async () => {
  actions.init()
});

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.edtSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Bairros</title>
    <v-card
      class="pa-5"
      style="width: 700px; margin: 0 auto"
    >
      <div id="pnCampos">
        <v-row>
          <v-col>
            <span>Descrição</span>
            <input
              type="text"
              v-model="state.dbBairro.DESCRICAO"
              class="obr ss"
              id="DESCRICAO"
              name="DESCRICAO"
              maxlength="20"
            />
          </v-col>
        </v-row>
      </div>

      <div class="d-flex justify-end my-4">
        <input
          type="text"
          style="margin: 5px 0 5px"
          autofocus
          placeholder="F1 - Localizar"
          :disabled="state.pnSearch"
          @keydown.enter="actions.search()"
          @keyup.arrow-down="state.gridPrincipal.focus(0)"
          id="edtSearch"
          class="ss"
        />
        <v-btn
          :disabled="state.pnSearch"
          size="small"
          class="ml-2 mt-1 elevation-0"
          color="primary"
          @click="actions.search()"
        >
          Localizar
        </v-btn>
      </div>

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

      <div id="gridPrincipal"></div>

      <div
        id="pnBotoes"
        class="mt-3"
        style="text-align: center"
      ></div>
    </v-card>
    <div id="pnCodigoTela">CADASTRO_BAIRROS</div>
  </v-container>
</template>
