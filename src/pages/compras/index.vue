<script setup lang="ts">
import { actions, state } from "./compras";
import { nextTick, onUnmounted, ref } from "vue";
import { useEventListener } from "@vueuse/core";
import globalActions from "@/store/globalActions";
import cSearchProduto from "./components/cSearchProduto.vue";

const tab = ref();

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    event.preventDefault();
    event.stopPropagation();
  }
});

nextTick(async () => {
  state.displayProduto.uso = state.displayProduto.simples;

  actions.grids();

  actions.getProdutos();
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <title>Compras</title>

  <v-card class="px-5" style="width: 1024px; margin: 0 auto">
    <v-tabs v-model="tab" align-tabs="center" density="compact">
      <v-tab value="produtos">Produtos</v-tab>
      <v-tab value="compras">Compras</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="produtos">
        <v-container>
          <v-row>
            <v-col cols="2">a</v-col>
            <v-col cols="8">
              <cSearchProduto />
              <div id="xgProduto"></div>
            </v-col>
            <v-col cols="2">c</v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="compras">
        <v-container> nnnnnnnnnnnn </v-container>
      </v-window-item>
    </v-window>
  </v-card>

  <div id="pnCodigoTela">COMPRAS</div>
  <v-btn
    variant="text"
    @click="globalActions.toggleTheme()"
    icon="mdi-theme-light-dark"
  ></v-btn>
</template>

<style></style>
