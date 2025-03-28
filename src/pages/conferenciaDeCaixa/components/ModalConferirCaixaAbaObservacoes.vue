<script setup lang="ts">
import { observacoesPorCaixa } from "../conferenciaDeCaixa";
</script>
<template>
  <v-card class="pa-3">
    <v-row>{{ observacoesPorCaixa }}</v-row>
  </v-card>
</template>
<style scoped></style>
