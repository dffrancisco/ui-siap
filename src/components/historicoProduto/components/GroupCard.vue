<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps<{
  title: string;
  icon: string;
}>();
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <div>{{ props.title }}</div>
    <div class="d-flex flex-column align-items-center">
      <slot></slot>
    </div>
  </div>
</template>
