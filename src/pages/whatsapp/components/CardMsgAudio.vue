<script setup lang="ts">
import { iMsgFormatada } from "../interfaces";

const MSG_ENVIADA_AUDIO = 5;

const props = defineProps({
  msgFormatada: {
    type: Object as () => iMsgFormatada,
    required: true,
    default: null,
  },
});
</script>

<template>
  <div
    class="msg"
    :class="props.msgFormatada.type == MSG_ENVIADA_AUDIO ? 'msg-enviada' : 'msg-recebida'"
  >
    <div
      class="audio px-1 pb-1"
      :class="props.msgFormatada.type == MSG_ENVIADA_AUDIO ? 'audio-enviada' : 'audio-recebida'"
    >
      <audio
        controls
        :src="props.msgFormatada.url"
      ></audio>
    </div>
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

.audio {
  cursor: pointer;
  border-radius: 0 0 8px 8px;
}

.audio-enviada {
  background-color: #dcf7c5;
}

.audio-recebida {
  background-color: #f2f2f2;
}
</style>
