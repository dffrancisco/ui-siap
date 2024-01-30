<script setup lang="ts">
import { state, actions } from "../descontoCliente";
</script>

<template>
  <div class="d-flex justify-end my-2">
    <v-row>
      <v-col>
        <span >LOCALIZAR MARCA</span>
        <input
          type="text"
          style="margin: 5px 0 5px"
          autofocus
          placeholder="F1 - Localizar"
          :disabled="state.pnSearch"
          @keydown.enter="actions.searchMarcas()"
          @keyup.arrow-down="state.gridMarca.focus(0)"
          id="edtMarcaSearch"
          class="ss"
        />
      </v-col>
    </v-row>
    <v-btn
      style="margin-top: 20px;"
      :disabled="state.pnSearch"
      size="x-small"
      class="ml-2 elevation-0"
      color="primary"
      icon="mdi-magnify"
      @click="actions.searchMarcas()"
    >
    </v-btn>
  </div>
</template>

<style scoped>
</style>
