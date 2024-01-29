<script setup lang="ts">
import $ from "jquery";
import { nextTick, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import marcasClienteSearch from "./components/marcasSearch.vue";
import clientesModal from "./components/clientesModal.vue";
import { actions, state } from "../descontoCliente/descontoCliente";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    // state.edtSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

nextTick(async () => {
  $(".ss").attr("autocomplete", "off");

    // state.edtSearch = <any>document.getElementById("edtSearch");

    actions.grids();
    actions.criarModais();
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
      style="width: 800px; margin: 0 auto;"
    >
      <div style="padding-bottom: 15px">
        <v-row>
          <v-col cols="4">
            <span>CNPJ</span>
            <input
              type="text"
              class="ss"
              @click="actions.onClickClienteModal"
            />
          </v-col>
          <v-col cols="7">
            <span>Razão Social</span>
            <input
              type="text"
              class="ss"
              @click="actions.onClickClienteModal"
            />
          </v-col>

          <v-btn
            style="margin-top: 20px"
            icon="mdi-magnify"
            color="blue"
            size="small"
            @click="actions.onClickClienteModal"
          >
          </v-btn>
        </v-row>
      </div>
      <div class="ss" style="height: 500px; text-transform: none;">
        <v-row>
          <v-col cols="4">
            <v-row style="margin-left: 7px; padding-top: 10px">
              <marcasClienteSearch style="width: 300px" />
            </v-row>
            <v-row style="margin-left: 7px;">
              <div id="pnMarcas"></div>
            </v-row>
          </v-col>
          <v-col
            cols="1"
            justify="center"
            style="margin-left: 0px"
          >
            <v-btn
              style="margin-top: 200px"
              icon="mdi-chevron-left mdi-24px"
              color="blue"
              size="x-small"
            >
            </v-btn>
            <v-btn
              style="margin-top: 10px"
              icon="mdi-chevron-right mdi-24px"
              color="blue"
              size="x-small"
            >
            </v-btn>
          </v-col>
          <v-col cols="7">
            <v-row
              style="margin-top: 30px"
              justify="center"
            >
              <h2>Marcas Adicionadas</h2>
            </v-row>
            <v-row style="margin-top: 24px; width: 430px;"> 
              <div id="pnMarcasAdicionadas"> </div>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <div id="pnCodigoTela">DESCONTO_CLIENTE</div>
    </v-card>
  </v-container>

  <div id="mdCliente" style="display: none;" title="Clientes">
    <clientesModal :opened="state.modalClienteOpened"/>
  </div>

</template>

<style scoped>
</style>
