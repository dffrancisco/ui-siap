<script lang="ts" setup>
const props = defineProps({
  boletosEmDia: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <v-card> {{ props.boletosEmDia }}</v-card>
</template>

<style scoped></style>
