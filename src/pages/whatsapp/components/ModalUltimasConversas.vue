<script setup lang="ts">
import CardMsg from "./CardMsg.vue";

const emits = defineEmits(["closeModalUltimasConversas"]);

const actions = {
  closeModalUltimasConversas() {
    emits("closeModalUltimasConversas");
  },
};
</script>

<template>
  <v-card
    height="700"
    class="container-principal"
  >
    <div class="header px-2 pt-3 pb-2">
      <v-icon
        color="primary"
        size="32"
        @click="actions.closeModalUltimasConversas"
        >mdi-chevron-left</v-icon
      >
      <div class="container-contato">
        <strong>FULANO DE TAL</strong>
        <span class="container-contato__numero">+55 (61) 99999-9999</span>
      </div>

      <v-icon
        color="#D32F2F"
        size="32"
        title="Fechar conversa"
      >
        mdi-account-remove</v-icon
      >
    </div>

    <div class="container-chat pt-2">
      <div class="container-msgs px-2 ga-3">
        <CardMsg v-for="card in 20" />
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.container-principal {
  background-color: #f2f2f2;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.container-contato {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-contato__numero {
  font-size: 10px;
  color: gray;
}

.container-chat {
  background-image: url("https://s3-alpha-sig.figma.com/img/351a/cdb5/ea7901e17f7cb0d61068f0f1d8f1f95d?Expires=1717977600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=on1xqvitfl9vfI6Cvn7iCm4m78OlcQC4Dhw~lsSn~lPAnos8sqJ17hSvLRjAXTVGJA~YfpQu7e3WHGixHHLFmUY5jH51O4ExHlPkMxmxtfV8Zp0~9uMUIFscKjq0U3uhxrlpDvbezV25RsXPXOO1ylfEwiawinSnkuRqf0dD4ILidDePzZgvkpmW0zV1WgOodmkEUBa8Ao46mT4YecCXUMWmnfu24trAn95HDgJ4d06ALi9tq0h5pr50fgWI2Nak9C04aYs-o--vGQR7ZtdsYYhgnpeLPuT7yXC2qzI2rNciAnJctOQlQrteH0f4jVuz2k0ajnSg4TUFz4e-nP-OQg__") !important;
  background-size: cover;
  flex-grow: 1;
}

.container-msgs {
  display: flex;
  align-items: end;
  flex-direction: column-reverse;
  overflow: auto;
  max-height: 620px;
}
</style>
