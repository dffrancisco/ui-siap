<script setup lang="ts">
import { iMsgFormatada } from "../interfaces";

const MSG_ENVIADA_TEXTO = 3;
const MSG_RECEBIDA_INVALIDA = 7;

const props = defineProps({
  msgFormatada: {
    type: Object as () => iMsgFormatada,
    required: true,
    default: null,
  },
});

const actions = {
  formatarQuebrasDeLinha(texto?: string) {
    return texto?.replace(/\n/g, "<br>");
  },
};
</script>

<template>
  <strong
    v-if="props.msgFormatada.type == MSG_ENVIADA_TEXTO"
    class="user px-2 pb-1"
    >{{ props.msgFormatada.user }}</strong
  >
  <span
    class="texto px-2"
    :class="props.msgFormatada.type == MSG_ENVIADA_TEXTO ? 'texto-enviada' : 'texto-recebida'"
    v-html="actions.formatarQuebrasDeLinha(props.msgFormatada.text)"
  ></span>
  <span
    class="hora px-2"
    :class="props.msgFormatada.type == MSG_ENVIADA_TEXTO ? 'hora-enviada' : 'hora-recebida'"
    >{{ props.msgFormatada.hora }}</span
  >
</template>

<style scoped>
.user {
  font-size: 12px;
  color: #5585b5;
  background-color: #dcf7c5;
  width: 100%;
  text-align: start;
}

.texto {
  font-size: 14px;
  max-width: 266px;
  min-width: 60px;
  width: 100%;
  text-align: left;
}

.texto-enviada {
  background-color: #dcf7c5;
}

.texto-recebida {
  background-color: #f2f2f2;
}

.hora {
  font-size: 10px;
  color: gray;
  width: 100%;
  text-align: end;
  border-radius: 0px 0px 8px 8px;
}

.hora-enviada {
  background-color: #dcf7c5;
}

.hora-recebida {
  background-color: #f2f2f2;
}
</style>
