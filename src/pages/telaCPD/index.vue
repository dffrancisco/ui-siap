<script setup lang="ts">
import { state, actions } from "./telaCPD";
import Login from "./login.vue";
import { onMounted, ref } from "vue";
import SelecaoLoja from "./components/selecaoLoja.vue";

onMounted(actions.init);
</script>

<template>
  <v-app>
    <v-main
      class="d-flex justify-center align-center"
      style="min-height: 100vh"
    >
      <login
        v-if="!state.loggedIn"
        @login="actions.login"
      />
      <SelecaoLoja
        v-else
        :lojas="state.lojas"
        @botaoLiberarcredito="actions.onclickrLiberarCredito"
        @botaoDevolucao="actions.onclickrDevolucaoManual"
      />
    </v-main>
  </v-app>
</template>
