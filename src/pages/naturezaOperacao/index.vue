<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { actions, state } from "./naturezaOperacao";
import { useEventListener } from "@vueuse/core";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key == "F1") {
    state.inputSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

onMounted(() => {
  actions.init();
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container class="d-flex justify-center">
    <v-card
      width="800"
      class="pa-4 d-flex flex-column ga-4"
      id="pnCampos"
    >
      <v-row>
        <v-col>
          <span> Descrição </span>
          <input
            v-model="state.dbNarurezaOperacao.DESCRICAO"
            type="text"
            class="obr ss"
            name="DESCRICAO"
            id="DESCRICAO"
            maxlength="255"
            style="text-transform: none"
          />
        </v-col>
        <v-col cols="2">
          <span> CFOP </span>
          <input
            v-model="state.dbNarurezaOperacao.CFOP"
            type="text"
            class="obr ss"
            name="CFOP"
            id="CFOP"
            maxlength="4"
            v-mask="'####'"
          />
        </v-col>
      </v-row>
      <div class="d-flex ga-4 align-center">
        <input
          type="text"
          placeholder="PESQUISAR (F1)"
          id="inputSearch"
          class="ss"
          :disabled="state.searchDisabled"
          @keyup.arrow-down="state.gridNaturezaOperacao.focus(0)"
          @keydown.enter="actions.searchGrupos"
        />
        <v-btn
          icon="mdi-magnify"
          color="primary"
          size="36"
          :disabled="state.searchDisabled"
          @click="actions.searchGrupos"
        />
      </div>
      <div id="gridNaturezaOperacao"> </div>
      <div
        id="pnBotoes"
        class="d-flex justify-center"
      ></div>
    </v-card>
  </v-container>
</template>
