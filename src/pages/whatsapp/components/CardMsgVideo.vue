<script setup lang="ts">
import { iMsgFormatada } from "../interfaces";

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
  <div class="container-video px-2">
    <video
      class="video"
      width="250"
      height="200"
      :src="props.msgFormatada.url"
      controls
    >
    </video>
  </div>
  <span
    v-if="props.msgFormatada.text && props.msgFormatada.text != ''"
    class="texto px-2"
    v-html="actions.formatarQuebrasDeLinha(props.msgFormatada.text)"
  ></span>
  <span class="hora px-2">{{ props.msgFormatada.hora }}</span>
</template>

<style scoped>
.container-video {
  background-color: #f2f2f2;
  overflow: hidden;
}

.video {
  border-radius: 8px;
  object-fit: cover;
  object-position: center;
}

.video:fullscreen {
  object-fit: contain;
}

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
