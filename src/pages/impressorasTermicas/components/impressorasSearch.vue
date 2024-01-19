<script setup lang="ts">
import { state, actions } from '../impressorasTermicas'
</script>

<template>
    <div class="d-flex justify-end my-4">
        <input
            type="text"
            style="margin: 5px 0 5px; "
            autofocus
            placeholder="F1 - Localizar"
            :disabled="state.disableSearch"
            @keydown.enter=""
            @keyup.arrow-down=""
            id="edtSearch"
            class="ss"
            v-model="state.edtSearch"
        />
        <v-btn
            :disabled="state.disableSearch"
            size="small"
            class="ml-2 mt-1 elevation-0"
            color="primary"
            @click="actions.search()"
        >
      Localizar
    </v-btn>
    </div>
</template>

<style scoped>
div {
  padding-top: 10px;
}
</style>