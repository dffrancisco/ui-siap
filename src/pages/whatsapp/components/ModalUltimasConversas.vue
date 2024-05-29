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
  background-image: url("../assets/background_chat.png");
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
