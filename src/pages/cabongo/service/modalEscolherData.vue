<script setup lang="ts">
import { state } from "../cabongo";

const props = defineProps<{
  data: string;
  quantidade: number;
}>();
</script>
<template>
  <v-data-table :header="state.headers"> </v-data-table>
</template>
<style scoped></style>
