<script setup lang="ts">
import { watch } from "vue";
import { iProdutos } from "../interfaces";

const props = defineProps<{
  produtos: iProdutos[];
  modalOpened: boolean;
}>();

const emit = defineEmits(["produtosEscolhidos", "closeModal"]);

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      //   state.gridMarcas.source(props.marcas);
    }
  }
);
</script>

<template></template>

<style scoped></style>
