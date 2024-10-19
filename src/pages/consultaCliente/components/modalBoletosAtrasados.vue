<script lang="ts" setup>
const props = defineProps({
  boletosAtrasados: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <v-card> {{ props.boletosAtrasados }}</v-card>
</template>

<style scoped></style>
