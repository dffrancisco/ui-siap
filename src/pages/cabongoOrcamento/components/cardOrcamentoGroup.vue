<script setup lang="ts"></script>
<template>
  <v-card class="container d-flex flex-column ga-3">
    <div class="d-flex justify-space-between w-100">
      <div class="d-flex ga-5">
        <div>
          <span><v-icon>mdi-package-variant-closed</v-icon> #15323</span>
        </div>
        <span class="status_orcamento">NÂO CONFERIDO</span>
      </div>
      <div class="d-flex ga-5">
        <span>24/07/2025</span>
        <span>10:08:43</span>
        <span>R$ 237,60</span>
        <v-icon>mdi-plus</v-icon>
      </div>
    </div>
    <div class="d-flex ga-5">
      <label><v-icon>mdi-account</v-icon> Solicitante: <span>Pedro</span></label>
      <label>Fornecedor: <span>Pedro</span></label>
    </div>
    <slot></slot>
  </v-card>
</template>
<style scoped>
.container {
  height: 300px;
  padding: 10px 20px;
}
.status_orcamento {
  background-color: aqua;
  border-radius: 15px;
  padding: 2px 5px;
}
</style>
