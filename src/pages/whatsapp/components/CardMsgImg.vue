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
    class="msg"
    :class="props.msgFormatada.type == MSG_ENVIADA_IMG ? 'msg-enviada' : 'msg-recebida'"
  >
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
      class="msg-texto px-2"
      :class="props.msgFormatada.type == MSG_ENVIADA_IMG ? 'msg-texto-enviada' : 'msg-texto-recebida'"
      v-html="actions.formatarQuebrasDeLinha(props.msgFormatada.text)"
    ></span>
    <span
      class="msg-hora px-2"
      :class="props.msgFormatada.type == MSG_ENVIADA_IMG ? 'msg-hora-enviada' : 'msg-hora-recebida'"
      >{{ props.msgFormatada.hora }}</span
    >
  </div>
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
