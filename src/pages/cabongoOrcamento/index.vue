<script setup lang="ts">
import { useRoute } from "vue-router";
import CardOrcamento from "./components/cardOrcamento.vue";
import CardOrcamentoGroup from "./components/cardOrcamentoGroup.vue";
import CardPesquisaOrcamento from "./components/cardPesquisaOrcamento.vue";
import { actions, state } from "./cabongoOrcamento";

const route = useRoute();
state.id_sociedade = parseInt(route?.query?.id_sociedade as string);
state.meuCNPJ = route?.query.meuCNPJ as string;
state.dataOrcamento = route?.query?.data as string;

actions.init();
</script>
<template>
  <v-container>
    <title>Cabongo-orçamento</title>
    <v-card
      class="pa-5"
      style="max-width: 900px; margin: 0 auto"
    >
      <label>{{ state.dataOrcamento }}</label>
      <CardPesquisaOrcamento />
      <CardOrcamentoGroup>
        <CardOrcamento />
      </CardOrcamentoGroup>
    </v-card>
  </v-container>
</template>
<style></style>
