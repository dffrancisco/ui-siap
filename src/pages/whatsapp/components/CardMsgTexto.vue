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
  <div
    class="msg"
    :class="props.msgFormatada.type == MSG_ENVIADA_TEXTO ? 'msg-enviada' : 'msg-recebida'"
  >
    <strong
      v-if="props.msgFormatada.type == MSG_ENVIADA_TEXTO"
      class="msg-user px-2 pb-1"
      >{{ props.msgFormatada.user }}</strong
    >
    <span
      class="msg-texto px-2"
      :class="props.msgFormatada.type == MSG_ENVIADA_TEXTO ? 'msg-texto-enviada' : 'msg-texto-recebida'"
      v-html="actions.formatarQuebrasDeLinha(props.msgFormatada.text)"
    ></span>
    <span
      class="msg-hora px-2"
      :class="props.msgFormatada.type == MSG_ENVIADA_TEXTO ? 'msg-hora-enviada' : 'msg-hora-recebida'"
      >{{ props.msgFormatada.hora }}</span
    >
  </div>
</template>

<style scoped>
.msg {
  display: flex;
  align-items: end;
  flex-direction: column;
}

.msg-enviada {
  border-radius: 8px 0px 0px 0px;
  border-right: 10px solid transparent;
  border-top: 8px solid #dcf7c5;
}

.msg-recebida {
  border-radius: 0px 8px 0px 0px;
  border-left: 10px solid transparent;
  border-top: 8px solid #f2f2f2;
}

.msg-user {
  font-size: 12px;
  color: #5585b5;
  background-color: #dcf7c5;
  width: 100%;
  text-align: start;
}

.msg-texto {
  font-size: 14px;
  max-width: 266px;
  min-width: 60px;
  width: 100%;
  text-align: left;
}

.msg-texto-enviada {
  background-color: #dcf7c5;
}

.msg-texto-recebida {
  background-color: #f2f2f2;
}

.msg-hora {
  font-size: 10px;
  color: gray;
  width: 100%;
  text-align: end;
  border-radius: 0px 0px 8px 8px;
}

.msg-hora-enviada {
  background-color: #dcf7c5;
}

.msg-hora-recebida {
  background-color: #f2f2f2;
}
</style>
