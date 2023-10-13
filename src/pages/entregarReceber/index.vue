<script setup lang="ts">
import { actions, state } from "./entregarReceber";
import { nextTick, onUnmounted } from "vue";
// import cSearch from "./components/cSearch.vue";
import { useEventListener } from "@vueuse/core";
import $ from "jquery";
import globalActions from "@/store/globalActions";

// const eventListener = useEventListener(document, "keydown", async (event) => {
//   if (event.key === "F1") {
//     state.edtSearch.select();
//     event.preventDefault();
//     event.stopPropagation();
//   }
// });

nextTick(async () => {
  // $(".ss").attr("autocomplete", "off");

  // state.edtSearch = <any>document.getElementById("edtSearch");

  actions.grids();

  state.gridPrincipal.queryOpen({});

  // state.gridPrincipal.queryOpen({ DESCRICAO: "" }, () => {
  //   state.gridPrincipal.focus();
  //   // validaOBR();
  // });
});

onUnmounted(() => {
  // removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Cadastro de Carros</title>
    <v-card class="pa-5" style="max-width: 1200px; margin: 0 auto">
      <cSearch />

      <div id="gridPrincipal"></div>
    </v-card>
    <div id="pnCodigoTela">entregarReceber</div>
  </v-container>
</template>

<style></style>
