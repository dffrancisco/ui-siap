<script lang="ts" setup>
defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>
