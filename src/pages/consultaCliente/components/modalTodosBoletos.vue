<script lang="ts" setup>
const props = defineProps({
  todosBoletos: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <v-card> {{ props.todosBoletos }}</v-card>
</template>

<style scoped></style>
