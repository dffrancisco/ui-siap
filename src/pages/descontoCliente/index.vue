<script setup lang="ts">
import modalCliente from "./components/modalCliente.vue";
import modalAdicionarMarca from "./components/modalAdicionarMarca.vue";
import { actions, state } from "../descontoCliente/descontoCliente";
import { nextTick, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";

nextTick(async () => {
  actions.init();
});

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.edtMarcaSearch.select();
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
              v-model="state.dbClienteSelecionado.CGC_CLIENTE"
              type="button"
              class="ss"
              name="CGC_CLIENTE"
              id="CGC_CLIENTE"
              @click="actions.onClickClienteModal"
            />
          </v-col>
          <v-col cols="8">
            <span>Razão Social</span>
            <input
              style="text-align: start"
              v-model="state.dbClienteSelecionado.NOME"
              type="button"
              class="ss"
              name="NAME"
              id="NAME"
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
      <div
        class="ss"
        style="height: 500px; text-transform: none"
      >
        <v-row>
          <v-col cols="4">
            <v-row style="margin-left: 7px; padding-top: 10px">
              <div class="d-flex justify-end my-2">
                <v-row>
                  <v-col>
                    <span>LOCALIZAR MARCA</span>
                    <input
                      type="text"
                      style="margin: 5px 0 5px"
                      autofocus
                      placeholder="F1 - Localizar"
                      :disabled="state.pnSearch"
                      @keydown.enter="actions.searchMarcas()"
                      @keyup.arrow-down="state.gridMarca.focus(0)"
                      id="edtMarcaSearch"
                      class="ss"
                    />
                  </v-col>
                </v-row>
                <v-btn
                  style="margin-top: 20px"
                  :disabled="state.pnSearch"
                  size="x-small"
                  class="ml-2 elevation-0"
                  color="primary"
                  icon="mdi-magnify"
                  @click="actions.searchMarcas()"
                >
                </v-btn>
              </div>
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
              @click="actions.removerMarca"
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
    id="modalCliente"
    style="display: none"
    title="Clientes"
  >
    <modalCliente
      @cancelar="actions.onClickCloseClienteModal"
      @clienteSelecionado="actions.setarCliente"
    />
  </div>

  <div
    id="mdAdicionarMarca"
    style="display: none"
    title="Adicionar Marca"
  >
    <modalAdicionarMarca
      :marcas="state.dbMarca"
      @cancelar="actions.onClickCloseAdicionarMarcaModal"
      @adicionarMarca="actions.adicionarMarca"
    />
  </div>
</template>

<style scoped></style>
