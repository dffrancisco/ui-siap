<script setup lang="ts">
import { state, actions } from "../marcas";
</script>

<template>
  <div class="d-flex justify-end my-2">
    <input
      type="text"
      style="margin: 5px 0 5px"
      autofocus
      placeholder="F1 - Localizar"
      :disabled="state.disabledSearch"
      @keydown.enter="actions.search()"
      @keyup.arrow-down="state.gridPrincipal.focus(0)"
      id="edtSearch"
      class="ss"
    />
    <v-btn
      :disabled="state.disabledSearch"
      size="small"
      class="ml-2 mt-1 elevation-0"
      color="primary"
      @click="actions.search()"
    >
      Localizar
    </v-btn>
  </div>
</template>