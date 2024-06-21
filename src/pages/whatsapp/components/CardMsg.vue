<script setup lang="ts">
import { computed } from "vue";
import { iMsgCallbell, iMsgFormatada } from "../interfaces";
import moment from "moment";
import CardMsgTexto from "./CardMsgTexto.vue";
import CardMsgImg from "./CardMsgImg.vue";
import CardMsgAudio from "./CardMsgAudio.vue";
import CardMsgVideo from "./CardMsgVideo.vue";
import CardMsgInvalida from "./CardMsgInvalida.vue";
import CardNota from "./CardNota.vue";

const MSG_RECEBIDA_TEXTO = 0;
const MSG_RECEBIDA_IMG = 1;
const MSG_RECEBIDA_AUDIO = 2;
const MSG_ENVIADA_TEXTO = 3;
const MSG_ENVIADA_IMG = 4;
const MSG_ENVIADA_AUDIO = 5;
const NOTA = 6;
const MSG_RECEBIDA_INVALIDA = 7;
const MSG_RECEBIDA_VIDEO = 8;

const props = defineProps({
  msgCallbell: {
    type: Object as () => iMsgCallbell,
    required: true,
    default: null,
  },
});

const actions = {
  extrairNomesUsuarios(texto: string) {
    const condicao = /\*([^*]+)\*:\s*([\s\S]+)/;
    const resultado = condicao.exec(texto);

    if (resultado) {
      const usuario = resultado[1].trim();
      const mensagem = resultado[2].trim();
      return {
        usuario: usuario,
        mensagem: mensagem,
      };
    }
    return {
      usuario: "",
      mensagem: texto,
    };
  },

  tratarUrl(url) {
    if (url.includes(".jpg") || url.includes(".png") || url.includes(".gif")) {
      return {
        type: MSG_RECEBIDA_IMG,
        url: url,
      };
    }

    if (url.includes(".mp3")) {
      return {
        type: MSG_RECEBIDA_AUDIO,
        url: url,
      };
    }

    if (url.includes(".mp4")) {
      return {
        type: MSG_RECEBIDA_VIDEO,
        url: url,
      };
    }

    return {
      type: MSG_RECEBIDA_INVALIDA,
      url: url,
    };
  },

  openURL(url: string) {
    window.open(url, "_blank");
  },
};

const computeds = {
  formatarMsg: computed(() => {
    const msg = props.msgCallbell;

    let msgFormatada: iMsgFormatada = {
      text: "",
      type: null,
      hora: null,
    };

    if (msg.status == "sent") {
      if (msg.text && msg.text != "" && (msg.attachments?.[0] == null || !msg.attachments)) {
        let mensagem_usuario = actions.extrairNomesUsuarios(msg.text);

        msgFormatada = {
          user: mensagem_usuario.usuario,
          text: mensagem_usuario.mensagem,
          type: MSG_ENVIADA_TEXTO,
          hora: moment(msg.createdAt).format("HH:mm"),
        };
      }

      if (msg.attachments?.[0]?.type === "image") {
        msgFormatada = {
          text: msg.attachments[0].payload?.meta?.caption,
          type: MSG_ENVIADA_IMG,
          url: msg.attachments[0].payload.url,
          hora: moment(msg.createdAt).format("HH:mm"),
        };
      }

      if (msg.attachments?.[0]?.type === "audio") {
        msgFormatada = {
          type: MSG_ENVIADA_AUDIO,
          url: msg.attachments[0].payload.url,
          hora: moment(msg.createdAt).format("HH:mm"),
        };
      }
    }

    if (msg.status == "received") {
      if (msg.text && msg.text != "" && !msg.attachments) {
        msgFormatada = {
          text: msg.text,
          type: MSG_RECEBIDA_TEXTO,
          hora: moment(msg.createdAt).format("HH:mm"),
        };
      }

      if (msg.attachments) {
        let url = msg.attachments[0];
        let urlTratada = actions.tratarUrl(url);

        msgFormatada = {
          text: msg.text,
          type: urlTratada.type,
          url: urlTratada.url,
          hora: moment(msg.createdAt).format("HH:mm"),
        };
      }
    }

    if (msg.status == "note") {
      if (msg.text.includes("Bot performed actions")) {
        msgFormatada = {
          text: null,
        };
      } else {
        msgFormatada = {
          text: msg.text,
          type: NOTA,
        };
      }
    }

    return msgFormatada;
  }),
};
</script>

<template>
  <!-- NOTA -->
  <CardNota
    v-if="computeds.formatarMsg.value.type == NOTA"
    :msgFormatada="computeds.formatarMsg.value"
  />

  <!-- MSG TEXTO -->
  <div
    v-if="
      computeds.formatarMsg.value.type == MSG_ENVIADA_TEXTO ||
      computeds.formatarMsg.value.type == MSG_RECEBIDA_TEXTO
    "
    class="container-msg"
    :class="
      computeds.formatarMsg.value.type == MSG_ENVIADA_TEXTO ? 'container-msg-enviada' : 'container-msg-recebida'
    "
  >
    <div
      class="msg"
      :class="computeds.formatarMsg.value.type == MSG_ENVIADA_TEXTO ? 'msg-enviada' : 'msg-recebida'"
    >
      <CardMsgTexto :msgFormatada="computeds.formatarMsg.value" />
    </div>
  </div>

  <!-- MSG IMG -->
  <div
    v-if="
      computeds.formatarMsg.value.type == MSG_ENVIADA_IMG || computeds.formatarMsg.value.type == MSG_RECEBIDA_IMG
    "
    class="container-msg"
    :class="
      computeds.formatarMsg.value.type == MSG_ENVIADA_IMG ? 'container-msg-enviada' : 'container-msg-recebida'
    "
  >
    <div
      class="msg"
      :class="computeds.formatarMsg.value.type == MSG_ENVIADA_IMG ? 'msg-enviada' : 'msg-recebida'"
    >
      <CardMsgImg :msgFormatada="computeds.formatarMsg.value" />
    </div>
  </div>

  <!-- MSG AUDIO -->
  <div
    v-if="
      computeds.formatarMsg.value.type == MSG_ENVIADA_AUDIO ||
      computeds.formatarMsg.value.type == MSG_RECEBIDA_AUDIO
    "
    class="container-msg"
    :class="
      computeds.formatarMsg.value.type == MSG_ENVIADA_AUDIO ? 'container-msg-enviada' : 'container-msg-recebida'
    "
  >
    <div
      class="msg"
      :class="computeds.formatarMsg.value.type == MSG_ENVIADA_AUDIO ? 'msg-enviada' : 'msg-recebida'"
    >
      <CardMsgAudio :msgFormatada="computeds.formatarMsg.value" />
    </div>
  </div>

  <!-- MSG VIDEO -->
  <div
    class="container-msg container-msg-recebida"
    v-if="computeds.formatarMsg.value.type == MSG_RECEBIDA_VIDEO"
  >
    <div class="msg msg-recebida">
      <CardMsgVideo :msgFormatada="computeds.formatarMsg.value" />
    </div>
  </div>

  <!-- MSG INVALIDA -->
  <div
    v-if="computeds.formatarMsg.value.type == MSG_RECEBIDA_INVALIDA"
    class="container-msg container-msg-recebida"
    @click="actions.openURL(computeds.formatarMsg.value.url)"
    style="cursor: pointer"
  >
    <div class="msg msg-recebida">
      <CardMsgInvalida :msgFormatada="computeds.formatarMsg.value" />
    </div>
  </div>
</template>

<style scoped>
.container-msg {
  display: flex;
  width: 100%;
}

.container-msg-enviada {
  justify-content: end;
}

.container-msg-recebida {
  justify-content: start;
}

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
</style>
