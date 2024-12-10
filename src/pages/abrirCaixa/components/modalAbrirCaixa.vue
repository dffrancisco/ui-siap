<script setup lang="ts">
import { iFuncionarios } from "../interfaces";

const props = defineProps<{
  funcionarios: iFuncionarios[];
  modalOpened: boolean;
}>();
</script>
<template
  ><div>{{ props.funcionarios }}</div>
</template>
