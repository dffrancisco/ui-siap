<script lang="ts" setup>
const props = defineProps({
  boletosEmAberto: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <v-card> {{ props.boletosEmAberto }}</v-card>
</template>

<style scoped></style>
