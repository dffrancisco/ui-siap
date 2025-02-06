<script setup lang="ts">
import { onMounted } from "vue";
onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container
    ><v-card
      :width="900"
      class="ma-auto pa-4"
    ></v-card
  ></v-container>
</template>

<style scoped></style>
