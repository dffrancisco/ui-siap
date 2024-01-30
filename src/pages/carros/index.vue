<script setup lang="ts">
import { actions, state } from "./carros";
import { nextTick, onUnmounted } from "vue";
import carrosSearch from "./components/carrosSearch.vue";
import { useEventListener } from "@vueuse/core";
import $ from "jquery";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.edtSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

nextTick(async () => {
  $(".ss").attr("autocomplete", "off");

  state.edtSearch = <any>document.getElementById("edtSearch");

  actions.grids();
  actions.getMontadoras();
  state.gridPrincipal.queryOpen({ DESCRICAO: "" }, () => {
    state.gridPrincipal.focus();
  });
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Cadastro de Carros</title>
    <v-card
      class="pa-5"
      style="width: 700px; margin: 0 auto"
    >
      <div id="pnCampos">
        <v-row>
          <v-col cols="6">
            <span>Descrição</span>
            <input
              v-model="state.dbCarro.DESCRICAO"
              type="text"
              id="DESCRICAO"
              name="DESCRICAO"
              required
              class="obr ss"
              maxlength="20"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="6">
            <span>Montadora</span>
            <select
              v-model="state.dbCarro.ID_MONTADORA"
              name="ID_MONTADORA"
              id="ID_MONTADORA"
              class="obr ss"
            >
              <option
                v-for="montadora in state.listaMontadoras"
                :value="montadora.ID_MONTADORA"
              >
                {{ montadora.DESCRICAO }}
              </option>
            </select>
          </v-col>
        </v-row>
      </div>

      <carrosSearch />

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

      <div id="gridPrincipal"></div>
      <div
        id="pnBotoes"
        class="mt-3"
        style="text-align: center"
      ></div>

      <div
        id="relatorio"
        class="print"
        style="display: none; width: 99% !important"
      ></div>
    </v-card>
    <div id="pnCodigoTela">CADASTRO_CARROS</div>
  </v-container>
</template>

<style scoped>.v-col {
  padding-bottom: 4px;
}</style>
