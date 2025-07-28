<script setup lang="ts">
import CardOrcamento from "./components/cardOrcamento.vue";
import CardOrcamentoGroup from "./components/cardOrcamentoGroup.vue";
import CardPesquisaOrcamento from "./components/cardPesquisaOrcamento.vue";
</script>
<template>
  <v-container>
    <title>Cabongo-orçamento</title>
    <v-card
      class="pa-5"
      style="max-width: 900px; margin: 0 auto"
    >
      <label>Nome da Loja</label>
      <CardPesquisaOrcamento />
      <CardOrcamentoGroup>
        <CardOrcamento />
      </CardOrcamentoGroup>
    </v-card>
  </v-container>
</template>
<style></style>
