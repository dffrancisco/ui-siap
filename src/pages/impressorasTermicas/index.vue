<script setup lang="ts">
import { nextTick } from "vue";
import impressorasSearch from "./components/impressorasSearch.vue";
import iInfoModelo from './components/iInfoModelo.vue'
import { state, actions } from "./impressorasTermicas";
import { useEventListener } from "@vueuse/core";
import { onUnmounted } from "vue";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.edtSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

nextTick(async () => {
  actions.init()

  state.edtSearch = <any>document.getElementById("edtSearch");
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});

</script>

<template>
  <v-container>
    <title>Impressoras Térmicas</title>
    <v-card
      class="pa-5"
      style="width: 800px; margin: 0 auto"
    >
      <div id="pnCampos">
        <v-row>
          <v-col cols="4"> 
            <span>IP</span>
            <input
              v-model="state.dbImpressorasTermicas.IP"
              maxlength="14"
              id="IP"
              name="IP"
              type="text"
              class="obr ss"
              v-mask="'###.###.###.##'"
            />
          </v-col>
          <v-col cols="4"> 
            <span>Local de Instalação</span> 
            <input
              v-model="state.dbImpressorasTermicas.LOCAL"
              id="LOCAL"
              name="LOCAL"
              type="text"
              class="obr ss"
            />
          </v-col>
          <v-col cols="4"> 
            <span>Carrossel</span> 
            <select
              v-model="state.dbImpressorasTermicas.CARROSSEL"
              class="obr ss"
              name="CARROSSEL"
              id="CARROSSEL"
            >
            <option value="S">SIM</option>
            <option value="N">NÃO</option>
            </select>
          </v-col>
          <v-col cols="3"> 
            <span>Situação</span>
            <select
              v-model="state.dbImpressorasTermicas.STATUS"
              class="obr ss"
              name="STATUS"
              id="STATUS"
            >
            <option value="AT">ATIVA</option>
            <option value="IN">INATIVA</option>
            </select>
          </v-col>
          <v-col cols="3"> 
            <span>Porta</span>
            <input
              v-model="state.dbImpressorasTermicas.PORTA"
              name="PORTA"
              id="PORTA"
              v-mask="'####'"
              maxlength="4"
              type="text"
              class="obr ss"
            />
          </v-col>
          <v-col cols="3">
              <v-icon class="mb-1" size="" @click="actions.onClickModelo">mdi-information</v-icon> 
              <span style="margin-right: 0;">
                Modelo
              </span>
            <select
              class="obr ss"
              v-model="state.dbImpressorasTermicas.DRIVER"
              name="DRIVER"
              id="DRIVER"
            >
            <option value="BEMA28">BEMA28</option>
            <option value="BEMA24">BEMA42</option>
            <option value="DARUMA">DARUMA</option>
            </select>
          </v-col>
          <v-col cols="3"> 
            <span>Qtde. Impressões</span>
            <input
            style="background-color: #85858554;"
              v-model="state.dbImpressorasTermicas.QTO_IMP"
              disabled
              name="QTO_IMP"
              type="text"
              class="ss"
            />
          </v-col>
        </v-row>
      </div>

      <impressorasSearch />

      <div id="gridPrincipal"></div>
      <div
        id="pnBotoes"
        class="mt-3"
        style="text-align: center"
      ></div>

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
    </v-card>
  </v-container>

  <div id="iInfoModelo" style="display: none;" title="Descrição dos Modelos">
    <iInfoModelo :opened="state.modalInfoModeloOpened"/>
  </div>

</template>
