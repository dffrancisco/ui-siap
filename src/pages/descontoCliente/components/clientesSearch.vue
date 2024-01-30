<script setup lang="ts">
import { state, actions } from "../descontoCliente";

const emit = defineEmits(["search"]);

function searchClientes() {
  emit("search");
}
</script>

<template>
  <div class="d-flex justify-end my-4">
    <input
      type="text"
      style="margin: 5px 0 5px"
      autofocus
      placeholder="F1 - Localizar"
      :disabled="state.pnSearch"
      @keydown.enter="searchClientes"
      @keyup.arrow-down="state.gridCliente.focus(0)"
      id="edtClienteSearch"
      class="ss"
    />
    <v-btn
      :disabled="state.pnSearch"
      size="small"
      class="ml-2 mt-1 elevation-0"
      color="primary"
      @click="searchClientes"
    >
      Localizar
    </v-btn>
  </div>
</template>

<style scoped></style>
