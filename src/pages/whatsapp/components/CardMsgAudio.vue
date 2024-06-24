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
    class="audio px-1 pb-1"
    :class="props.msgFormatada.type == MSG_ENVIADA_AUDIO ? 'audio-enviada' : 'audio-recebida'"
  >
    <audio
      controls
      :src="props.msgFormatada.url"
    ></audio>
  </div>
</template>

<style scoped>
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
