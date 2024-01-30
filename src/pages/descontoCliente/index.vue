<script setup lang="ts">
import $ from "jquery";
import { nextTick, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import marcasClienteSearch from "./components/marcasSearch.vue";
import clientesModal from "./components/clientesModal.vue";
import adicionarMarcaModal from "./components/adicionarMarcaModal.vue";
import { actions, state } from "../descontoCliente/descontoCliente";

nextTick(async () => {
  $(".ss").attr("autocomplete", "off");

  state.edtClienteSearch = <any>document.getElementById("edtClienteSearch");

  actions.grids();
  actions.criarModais();

  state.gridCliente.queryOpen({ NOME: "" }, () => {
    state.gridCliente.focus();
  });
  //   state.gridPrincipal.queryOpen({ NOME: "" }, () => {
  //     state.gridPrincipal.focus();
  //   });
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
          <v-col cols="3">
            <span>CNPJ</span>
            <input
              style="text-align: start"
              v-model="state.clienteSelecionado.CGC_CLIENTE"
              type="button"
              class="ss"
              name="CGC_CLIENTE"
              id="CGC_CLIENTE"
              @click="actions.onClickClienteModal"
              :disabled="state.clienteDisabled"
            />
          </v-col>
          <v-col cols="8">
            <span>Razão Social</span>
            <input
              style="text-align: start"
              v-model="state.clienteSelecionado.NOME"
              type="button"
              class="ss"
              name="NAME"
              id="NAME"
              @click="actions.onClickClienteModal"
              :disabled="state.clienteDisabled"
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
      <div
        class="ss"
        style="height: 500px; text-transform: none"
      >
        <v-row>
          <v-col cols="4">
            <v-row style="margin-left: 7px; padding-top: 10px">
              <marcasClienteSearch style="width: 300px" />
            </v-row>
            <v-row style="margin-left: 7px">
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
              icon="mdi-chevron-right mdi-24px"
              color="blue"
              size="x-small"
              @click="actions.onClickAdicionarMarcaModal"
            >
            </v-btn>
            <v-btn
              style="margin-top: 10px"
              icon="mdi-chevron-left mdi-24px"
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
            <v-row style="margin-top: 24px; width: 430px">
              <div id="pnMarcasAdicionadas"> </div>
            </v-row>
          </v-col>
        </v-row>
      </div>

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

      <div id="pnCodigoTela">DESCONTO_CLIENTE</div>
    </v-card>
  </v-container>

  <div
    id="mdCliente"
    style="display: none"
    title="Clientes"
  >
    <clientesModal :opened="state.modalClienteOpened" />
  </div>

  <div
    id="mdAdicionarMarca"
    style="display: none"
    title="Adicionar Marca"
  >
    <adicionarMarcaModal :opened="state.modalAdicionarMarcaOpened" />
  </div>
</template>

<style scoped></style>
