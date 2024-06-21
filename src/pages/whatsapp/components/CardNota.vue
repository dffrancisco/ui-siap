<script lang="ts" setup>
import { iMsgFormatada } from "../interfaces";

const props = defineProps({
  msgFormatada: {
    type: Object as () => iMsgFormatada,
    required: true,
    default: null,
  },
});

const actions = {
  formatarQuebrasDeLinha(texto: string) {
    return texto.replace(/\n/g, "<br>");
  },
};
</script>

<template>
  <div class="container-nota">
    <div class="nota pa-2">
      <span v-html="actions.formatarQuebrasDeLinha(props.msgFormatada.text)"></span>
    </div>
  </div>
</template>

<style scoped>
.container-nota {
  width: 100%;
  display: flex;
  justify-content: center;
}

.nota {
  background-color: #f8f398;
  flex-direction: column;
  display: flex;
  max-width: 300px;
  text-align: center;
}
</style>
