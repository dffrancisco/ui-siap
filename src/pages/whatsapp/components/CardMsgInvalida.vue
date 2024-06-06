<script setup lang="ts">
import { iMsgFormatada } from "../interfaces";

const props = defineProps({
  msgFormatada: {
    type: Object as () => iMsgFormatada,
    required: true,
    default: null,
  },
});
</script>

<template>
  <span class="texto px-2 d-flex align-center"
    ><v-icon
      color="warning"
      class="mr-1"
      >mdi-alert</v-icon
    >Mensagem Inválida</span
  >
  <span class="hora px-2">{{ props.msgFormatada.hora }}</span>
</template>

<style scoped>
.texto {
  font-size: 14px;
  max-width: 266px;
  min-width: 60px;
  width: 100%;
  text-align: left;
  background-color: #f2f2f2;
}

.hora {
  font-size: 10px;
  color: gray;
  width: 100%;
  text-align: end;
  border-radius: 0px 0px 8px 8px;
  background-color: #f2f2f2;
}
</style>
