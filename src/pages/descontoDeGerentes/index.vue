<script setup lang="ts">
import { actions, state } from "../descontoDeGerentes/descontoDeGerentes";
import { onMounted, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";

onMounted(() => {
  actions.init();
});

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    event.preventDefault();
    event.stopPropagation();
  }
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Desconto Gerentes</title>
    <v-card
      class="pa-5 mx-auto"
      max-width="1000px"
    >
      <v-row>
        <v-col cols="6">
          <h4 class="mb-3">Usuários sem permissão para desconto</h4>
          <div
            id="pnUsuariosSemPermissao"
            style="height: 400px"
          ></div>
        </v-col>

        <v-col cols="6">
          <h4 class="mb-3">Usuários com permissão para desconto</h4>
          <div
            id="pnUsuariosComPermissao"
            style="height: 400px"
          ></div>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="primary"
            class="mt-3"
          >
            Alterar Senha
          </v-btn>
        </v-col>
      </v-row>

      <v-overlay
        :model-value="state.loading"
        class="align-center justify-center"
        persistent
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>

      <div
        id="pnCodigoTela"
        class="mt-3 text-center"
        >descontoDeGerentes</div
      >
    </v-card>
  </v-container>
</template>

<style scoped>
h4 {
  text-align: center;
}
</style>
