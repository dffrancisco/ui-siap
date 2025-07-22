<script setup lang="ts">
import utils from "@/ts/utils";
</script>

<template>
  <v-card
    @click=""
    class="bg-white cards-filho d-flex align-center justify-space-evenly"
  >
    <v-avatar> <img src="/src/assets/sem_foto.jpg" /></v-avatar>
    <span class="text-h6"> {{ "Pedro Thales" }}</span>
  </v-card>
</template>

<style scoped>
.cards-filho {
  max-width: 100%;
  width: 15rem;
  height: 4rem;
  padding: 2px;
  border-radius: 15px;
}

img {
  width: 5rem;
}
</style>
