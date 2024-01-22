<script setup lang="ts">
import { nextTick } from "vue";
import impressorasSearch from "./components/impressorasSearch.vue";
import iInfoModelo from './components/iInfoModelo.vue'
import { state, actions } from "./impressorasTermicas";



nextTick(async () => {
  actions.getDrivers();
  actions.grids();

  state.gridPrincipal.queryOpen({ IP: "", LOCAL: "" }, () => {
    state.gridPrincipal.focus();
  });
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
          <v-col cols="4"> <!--IP-->
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
          <v-col cols="4"> <!--LOCAL-->
            <span>Local de Instalação</span> 
            <input
              v-model="state.dbImpressorasTermicas.LOCAL"
              id="LOCAL"
              name="LOCAL"
              type="text"
              class="obr ss"
            />
          </v-col>
          <v-col cols="4"> <!--CARROSSEL-->
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
          <v-col cols="3"> <!--SITUAÇÃO-->
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
          <v-col cols="3"> <!--PORTA-->
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
          <v-col cols="3"> <!--MODELO-->
            <span style="margin-right: 0;">
              Modelo
              <v-icon class="mb-1" size="" @click="actions.onClickModelo">mdi-information</v-icon> 
            </span>
            <select
              class="obr ss"
              v-model="state.dbImpressorasTermicas.DRIVER"
              name="DRIVER"
              id="DRIVER"
            >
            <option value="BEMA28">BEMA28</option>
            <option value="BEMA24">BEMA24</option>
            <option value="DARUMA">DARUMA</option>
            </select>
          </v-col>
          <v-col cols="3"> <!--QTDE IMP-->
            <span>Qtde. Impressões</span>
            <input
            style="background-color: #85858554;"
              v-model="state.dbImpressorasTermicas.QTO_IMP"
              disabled
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

  <div id="iInfoModelo" style="display: none;">
    <iInfoModelo :opened="state.modalInfoModeloOpened"/>
  </div>

</template>
