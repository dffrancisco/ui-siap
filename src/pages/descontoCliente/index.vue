<script setup lang="ts">
import $ from "jquery";
import { nextTick, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import descontoClienteSearch from "./components/descontoClienteSearch.vue";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    // state.edtSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

nextTick(async () => {
  $(".ss").attr("autocomplete", "off");

  //   state.edtSearch = <any>document.getElementById("edtSearch");

  //   actions.grids();
  //   state.gridPrincipal.queryOpen({ NOME: "" }, () => {
  //     state.gridPrincipal.focus();
  //   });
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Desconto Cliente</title>
    <v-card
      class="pa-5"
      style="width: 800px; margin: 0 auto"
    >
      <div style="padding-bottom: 15px">
        <v-row>
          <v-col cols="4">
            <span>CNPJ</span>
            <input
              type="text"
              class="ss"
            />
          </v-col>
          <v-col cols="7">
            <span>Razão Social</span>
            <input
              type="text"
              class="ss"
            />
          </v-col>

          <v-btn
            style="margin-top: 20px"
            icon="mdi-magnify"
            color="blue"
            size="small"
          >
          </v-btn>
        </v-row>
      </div>
      <div class="ss">
        <v-row>
          <v-col cols="4">
            <v-row style="margin-left: 7px; padding-top: 10px">
              <descontoClienteSearch style="width: 300px" />
            </v-row>
            <v-row>
              <div id="pnMarcas"></div>
            </v-row>
          </v-col>
          <v-col
            cols="1"
            justify="center"
            style="margin-left: 50px"
          >
            <v-btn
              style="margin-top: 200px"
              icon="mdi-chevron-left"
              color="blue"
              size="small"
            >
            </v-btn>
            <v-btn
              style="margin-top: 10px"
              icon="mdi-chevron-right"
              color="blue"
              size="small"
            >
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-row
              style="margin-top: 17px"
              justify="center"
            >
              <h2>Marcas Adicionadas</h2>
            </v-row>
            <v-row>
              <div id="pnMarcasAdicionadas"> </div>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <div id="pnCodigoTela">DESCONTO_CLIENTE</div>
    </v-card>
  </v-container>
</template>

<style scoped></style>
