<script setup lang="ts">
import { iMsgFormatada } from "../interfaces";

const MSG_ENVIADA_IMG = 4;

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
    class="img px-2"
    :class="props.msgFormatada.type == MSG_ENVIADA_IMG ? 'img-enviada' : 'img-recebida'"
  >
    <PhotoProvider :default-backdrop-opacity="0.8">
      <PhotoConsumer :src="props.msgFormatada.url">
        <img
          :src="props.msgFormatada.url"
          class="view-box img-miniatura"
      /></PhotoConsumer>
    </PhotoProvider>
  </div>
  <span
    v-if="props.msgFormatada.text && props.msgFormatada.text != ''"
    class="texto px-2"
    :class="props.msgFormatada.type == MSG_ENVIADA_IMG ? 'texto-enviada' : 'texto-recebida'"
    v-html="actions.formatarQuebrasDeLinha(props.msgFormatada.text)"
  ></span>
  <span
    class="hora px-2"
    :class="props.msgFormatada.type == MSG_ENVIADA_IMG ? 'hora-enviada' : 'hora-recebida'"
    >{{ props.msgFormatada.hora }}</span
  >
</template>

<style>
.PhotoSlider__Wrapper .PhotoSlider__BannerWrap {
  background-color: rgba(0, 0, 0, 0);
}

.PhotoSlider__Wrapper .PhotoSlider__BannerWrap .PhotoSlider__BannerRight svg:nth-child(1),
.PhotoSlider__Wrapper .PhotoSlider__BannerWrap .PhotoSlider__BannerRight svg:nth-child(4),
.PhotoSlider__Wrapper .PhotoSlider__BannerWrap .PhotoSlider__BannerRight svg:nth-child(5) {
  display: none;
}

.PhotoSlider__Wrapper .PhotoSlider__BannerWrap .PhotoSlider__Counter {
  color: transparent;
}
</style>

<style scoped>
.img {
  overflow: hidden;
}

.img-enviada {
  background-color: #dcf7c5;
}

.img-recebida {
  background-color: #f2f2f2;
}

.img-miniatura {
  width: 250px;
  max-height: 200px;
  object-fit: cover;
  object-position: top;
  cursor: pointer;
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
