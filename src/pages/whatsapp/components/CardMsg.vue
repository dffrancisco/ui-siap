<script setup lang="ts">
import { computed } from "vue";
import { iMsgCallbell, iMsgFormatada } from "../interfaces";
import moment from "moment";

const MSG_RECEBIDA_TEXTO = 0;
const MSG_RECEBIDA_IMG = 1;
const MSG_RECEBIDA_AUDIO = 2;
const MSG_ENVIADA_TEXTO = 3;
const MSG_ENVIADA_IMG = 4;
const MSG_ENVIADA_AUDIO = 5;
const NOTA = 6;

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
      usuario: "ROBÔ",
      mensagem: texto,
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

    if (msg.status == "sent" && msg.text && msg.text != "" && !msg.attachments) {
      let mensagem_usuario = actions.extrairNomesUsuarios(msg.text);

      msgFormatada = {
        user: mensagem_usuario.usuario,
        text: mensagem_usuario.mensagem,
        type: MSG_ENVIADA_TEXTO,
        hora: moment(msg.createdAt).format("HH:mm"),
      };
    }

    if (msg.status == "sent" && msg.attachments?.[0]?.type === "image") {
      msgFormatada = {
        text: msg.attachments[0].payload.meta.caption,
        type: MSG_ENVIADA_IMG,
        url: msg.attachments[0].payload.url,
        hora: moment(msg.createdAt).format("HH:mm"),
      };
    }

    if (msg.status == "sent" && msg.attachments?.[0]?.type === "audio") {
      msgFormatada = {
        type: MSG_ENVIADA_AUDIO,
        url: msg.attachments[0].payload.url,
        hora: moment(msg.createdAt).format("HH:mm"),
      };
    }

    if (msg.status == "received" && msg.text && msg.text != "" && !msg.attachments) {
      msgFormatada = {
        text: msg.text,
        type: MSG_RECEBIDA_TEXTO,
        hora: moment(msg.createdAt).format("HH:mm"),
      };
    }

    if (msg.status == "received" && msg.attachments?.[0]?.type === "image") {
      msgFormatada = {
        text: msg.attachments[0].payload.meta.caption,
        type: MSG_RECEBIDA_IMG,
        url: msg.attachments[0].payload.url,
        hora: moment(msg.createdAt).format("HH:mm"),
      };
    }

    if (msg.status == "received" && msg.attachments?.[0]?.type === "audio") {
      msgFormatada = {
        type: MSG_RECEBIDA_AUDIO,
        url: msg.attachments[0].payload.url,
        hora: moment(msg.createdAt).format("HH:mm"),
      };
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
      <span
        class="nota__text"
        v-html="actions.formatarQuebrasDeLinha(computeds.formatarMsg.value.text)"
      ></span>
    </div>
  </div>

  <!-- MSG ENVIADA TEXTO -->
  <div
    v-if="computeds.formatarMsg.value.type == MSG_ENVIADA_TEXTO"
    class="container-msg-enviada"
  >
    <div class="msg-enviada">
      <strong class="msg-enviada__user px-2 pb-1">{{ computeds.formatarMsg.value.user }}</strong>
      <span
        class="msg-enviada__textMsg px-2"
        v-html="actions.formatarQuebrasDeLinha(computeds.formatarMsg.value.text)"
      ></span>
      <span class="msg-enviada__hora px-2">{{ computeds.formatarMsg.value.hora }}</span>
    </div>
  </div>

  <!-- MSG ENVIADA AUDIO -->
  <div
    v-if="computeds.formatarMsg.value.type == MSG_ENVIADA_AUDIO"
    class="container-msg-enviada"
  >
    <div class="msg-enviada">
      <div
        class="msg-enviada__audio px-1 pb-1"
        @click="actions.openURL(computeds.formatarMsg.value.url)"
      >
        <v-card class="pa-2">
          <span><v-icon class="mr-1">mdi-music-note</v-icon>Mensagem de voz</span>
        </v-card>
      </div>
    </div>
  </div>

  <!-- MSG ENVIADA FOTO -->
  <div
    v-if="computeds.formatarMsg.value.type == MSG_ENVIADA_IMG"
    class="container-msg-enviada"
  >
    <div class="msg-enviada">
      <div class="msg-enviada-foto px-2">
        <img
          :src="computeds.formatarMsg.value.url"
          class="msg-enviada-foto__img"
          @click="actions.openURL(computeds.formatarMsg.value.url)"
        />
      </div>
      <span
        v-if="computeds.formatarMsg.value.text && computeds.formatarMsg.value.text != ''"
        class="msg-enviada__textMsg px-2"
        v-html="actions.formatarQuebrasDeLinha(computeds.formatarMsg.value.text)"
      ></span>
      <span class="msg-enviada__hora px-2">{{ computeds.formatarMsg.value.hora }}</span>
    </div>
  </div>

  <!-- MSG RECEBIDA TEXTO -->
  <div
    v-if="computeds.formatarMsg.value.type == MSG_RECEBIDA_TEXTO"
    class="container-msg-recebida"
  >
    <div class="msg-recebida">
      <span
        class="msg-recebida__textMsg px-2"
        v-html="actions.formatarQuebrasDeLinha(computeds.formatarMsg.value.text)"
      ></span>
      <span class="msg-recebida__hora px-2">{{ computeds.formatarMsg.value.hora }}</span>
    </div>
  </div>

  <!-- MSG ENVIADA AUDIO -->
  <div
    v-if="computeds.formatarMsg.value.type == MSG_RECEBIDA_AUDIO"
    class="container-msg-recebida"
  >
    <div class="msg-recebida">
      <div
        class="msg-recebida__audio px-1 pb-1"
        @click="actions.openURL(computeds.formatarMsg.value.url)"
      >
        <v-card class="pa-2">
          <span><v-icon class="mr-1">mdi-music-note</v-icon>Mensagem de voz</span>
        </v-card>
      </div>
    </div>
  </div>

  <!-- MSG RECEBIDA FOTO -->
  <div
    v-if="computeds.formatarMsg.value.type == MSG_RECEBIDA_IMG"
    class="container-msg-recebida"
  >
    <div class="msg-recebida">
      <div class="msg-recebida-foto px-2">
        <img
          :src="computeds.formatarMsg.value.url"
          class="msg-recebida-foto__img"
        />
      </div>
      <span
        class="msg-recebida__hora px-2"
        v-html="actions.formatarQuebrasDeLinha(computeds.formatarMsg.value.text)"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.container-msg-enviada {
  display: flex;
  justify-content: end;
  width: 100%;
}

.msg-enviada {
  border-radius: 8px 0px 0px 0px;
  border-right: 10px solid transparent;
  border-top: 8px solid #dcf7c5;
  display: flex;
  align-items: end;
  flex-direction: column;
}

.msg-enviada__user {
  font-size: 12px;
  color: #5585b5;
  background-color: #dcf7c5;
  width: 100%;
  text-align: start;
}

.msg-enviada__textMsg {
  font-size: 14px;
  max-width: 266px;
  min-width: 60px;
  width: 100%;
  text-align: justify;
  background-color: #dcf7c5;
}

.msg-enviada__hora {
  font-size: 10px;
  color: gray;
  background-color: #dcf7c5;
  width: 100%;
  text-align: end;
  border-radius: 0px 0px 8px 8px;
}

.container-msg-recebida {
  display: flex;
  justify-content: start;
  width: 100%;
}

.msg-recebida {
  background-color: transparent;
  border-radius: 0px 8px 0px 0px;
  border-left: 10px solid transparent;
  border-top: 8px solid #f2f2f2;
  display: flex;
  align-items: end;
  flex-direction: column;
}

.msg-recebida__textMsg {
  font-size: 14px;
  max-width: 266px;
  min-width: 60px;
  text-align: justify;
  background-color: #f2f2f2;
}

.msg-recebida__hora {
  font-size: 10px;
  color: gray;
  background-color: #f2f2f2;
  width: 100%;
  text-align: end;
  border-radius: 0px 0px 8px 8px;
}

.msg-enviada-foto {
  background-color: #dcf7c5;
}

.msg-enviada-foto__img {
  width: 250px;
  height: 200px;
  cursor: pointer;
}

.msg-recebida-foto {
  background-color: #f2f2f2;
}

.msg-recebida-foto__img {
  width: 250px;
  height: 200px;
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
