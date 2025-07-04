<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions } from "./historicoTesteModal";
import HistoricoProduto from "@/components/historicoProduto/historicoProduto.vue";
import ModalhistoricoProduto from "@/components/historicoProduto/ModalhistoricoProduto.vue";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-btn @click="actions.onclickAbrir">oi</v-btn>
  <v-dialog
    v-model="state.modalAbrirCartoes"
    max-width="1200px"
  >
    <ModalhistoricoProduto :cod-produto="3976" />
  </v-dialog>
</template>

<style></style>
