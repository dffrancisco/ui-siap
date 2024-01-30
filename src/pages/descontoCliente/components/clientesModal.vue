<script setup lang="ts">
import clientesSearch from "./clientesSearch.vue";
import { useEventListener } from "@vueuse/core";
import { onUnmounted } from "vue";
import { state } from "../descontoCliente";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.edtClienteSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }

  onUnmounted(() => {
    removeEventListener("keydown", eventListener);
  });
});
</script>

<template>
  <v-container class="pa-1 pt-0">
    <title>Clientes</title>
    <div id="clienteCampos">
      <clientesSearch />
      <div id="gridCliente"></div>
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
