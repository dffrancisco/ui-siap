<script setup lang="ts">
import clientesSearch from "./clientesSearch.vue";
</script>

<template>
  <v-container class="pa-1 pt-0">
    <title>Clientes</title>
    <div id="clienteCampos">
      <clientesSearch />
      <div id="pnClientes"></div>
      <div
        id="btnClientes"
        class="mt-3"
        style="text-align: center"
      >
      </div>
    </div>
  </v-container>
</template>

<style scoped>
  #btnClientes {
    display: flex;
    justify-content: space-between;
  }
</style>
