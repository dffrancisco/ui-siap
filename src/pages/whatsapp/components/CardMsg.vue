<script setup lang="ts">
import { computed } from "vue";
import { iMsgCallbell, iMsgFormatada } from "../interfaces";
import moment from "moment";
import CardMsgTexto from "./CardMsgTexto.vue";
import CardMsgImg from "./CardMsgImg.vue";

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

  formatarQuebrasDeLinha(texto: string) {
    return texto.replace(/\n/g, "<br>");
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
  <div
    v-if="computeds.formatarMsg.value.type == NOTA"
    class="container-nota"
  >
    <div class="nota pa-2">
      <span v-html="actions.formatarQuebrasDeLinha(computeds.formatarMsg.value.text)"></span>
    </div>
  </div>

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
    <CardMsgTexto :msgFormatada="computeds.formatarMsg.value" />
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
    <CardMsgImg :msgFormatada="computeds.formatarMsg.value" />
  </div>

  <!-- MSG ENVIADA AUDIO -->
  <div
    v-if="computeds.formatarMsg.value.type == MSG_ENVIADA_AUDIO"
    class="container-msg-enviada"
  >
    <div class="msg-enviada">
      <div class="msg-enviada__audio px-1 pb-1">
        <audio
          controls
          :src="computeds.formatarMsg.value.url"
        ></audio>
      </div>
    </div>
  </div>

  <!-- MSG RECEBIDA AUDIO -->
  <div
    v-if="computeds.formatarMsg.value.type == MSG_RECEBIDA_AUDIO"
    class="container-msg-recebida"
  >
    <div class="msg-recebida">
      <div class="msg-recebida__audio px-1 pb-1">
        <audio
          controls
          :src="computeds.formatarMsg.value.url"
        ></audio>
      </div>
    </div>
  </div>

  <!-- MSG RECEBIDA VIDEO -->
  <div
    class="container-msg-recebida"
    v-if="computeds.formatarMsg.value.type == MSG_RECEBIDA_VIDEO"
  >
    <div class="msg-recebida">
      <div class="msg-recebida-video px-2">
        <video
          class="msg-recebida-video__video"
          width="250"
          height="200"
          :src="computeds.formatarMsg.value.url"
          controls
        >
        </video>
      </div>
      <span
        v-if="computeds.formatarMsg.value.text && computeds.formatarMsg.value.text != ''"
        class="msg-recebida__textMsg px-2"
        v-html="actions.formatarQuebrasDeLinha(computeds.formatarMsg.value.text)"
      ></span>
      <span class="msg-recebida__hora px-2">{{ computeds.formatarMsg.value.hora }}</span>
    </div>
  </div>

  <!-- MSG INVALIDA -->
  <div
    v-if="computeds.formatarMsg.value.type == MSG_RECEBIDA_INVALIDA"
    class="container-msg-recebida"
    @click="actions.openURL(computeds.formatarMsg.value.url)"
    style="cursor: pointer"
  >
    <div class="msg-recebida">
      <span class="msg-recebida__textMsg px-2 d-flex align-center"
        ><v-icon
          color="warning"
          class="mr-1"
          >mdi-alert</v-icon
        >Mensagem Inválida</span
      >
      <span class="msg-recebida__hora px-2">{{ computeds.formatarMsg.value.hora }}</span>
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

.msg-recebida-video {
  background-color: #f2f2f2;
  overflow: hidden;
}

.msg-recebida-video__video {
  border-radius: 8px;
  object-fit: cover;
  object-position: center;
}

.msg-recebida-video__video:fullscreen {
  object-fit: contain;
}

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

.msg-enviada__audio {
  background-color: #dcf7c5;
  cursor: pointer;
  border-radius: 0 0 8px 8px;
}

.msg-recebida__audio {
  background-color: #f2f2f2;
  cursor: pointer;
  border-radius: 0 0 8px 8px;
}
</style>
