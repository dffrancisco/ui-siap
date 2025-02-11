<script setup lang="ts">
import { actions, state, eventListener } from "./sociedade";
import { onMounted, onUnmounted } from "vue";

onMounted(async () => {
  await actions.init();

  window.addEventListener("keydown", eventListener);
});

onUnmounted(() => {
  window.removeEventListener("keydown", eventListener);
});

</script>

<template>
  <v-container>
    <v-card
      width="700"
      class="pa-5 ma-auto"
    >
    
      <div id="pnCampos">
        <v-row class="mt-n1">
          <v-col cols="6">
            <span>Sociedade</span>
            <input
              v-model="state.dbSociedade.ID_SOCIEDADE"
              type="text"
              id="ID_SOCIEDADE"
              name="ID_SOCIEDADE"
              class="obr ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="6">
            <span>CNPJ</span>
            <input
              v-model="state.dbSociedade.CNPJ"
              type="text"
              id="CNPJ"
              name="CNPJ"
              class="obr ss"
              maxlength="18"
              v-mask="'##.###.###/####-##'"
              autocomplete="off"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col cols="1">
            <span>ID Empresa</span>
            <input
              v-model="state.dbSociedade.ID_EMPRESA"
              type="text"
              id="ID_EMPRESA"
              name="ID_EMPRESA"
              class="obr ss"
              maxlength="60"
              autocomplete="off"
              v-mask="0"
            />
          </v-col>
          <v-col cols="3">
            <span>Caminho Servidor</span>
            <input
              v-model="state.dbSociedade.CAMINHO_SERVIDOR"
              type="text"
              id="CAMINHO_SERVIDOR"
              name="CAMINHO_SERVIDOR"
              class="ss"
              maxlength="18"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>CPF</span>
            <input
              v-model="state.dbSociedade.HOST"
              type="text"
              id="HOST"
              name="HOST"
              class="ss"
              maxlength="14"
              autocomplete="off"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col cols="3">
            <span>Caminho do banco</span>
            <input
              v-model="state.dbSociedade.BANCO"
              type="text"
              id="BANCO"
              name="BANCO"
              class="obr ss"
              maxlength="10"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="3">
            <span>Nome Fantasia</span>
            <input
              v-model="state.dbSociedade.FANTASIA"
              type="text"
              id="FANTASIA"
              name="FANTASIA"
              class="obr ss"
              maxlength="10"
              v-mask="'####-#'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Gera SPED</span>
            <v-select
             
              :items="['Sim', 'Não','--']"
              id="GERA_SPED"
              name="GERA_SPED"
              class="obr ss"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Regime</span>
            <input
              v-model="state.dbSociedade.REGIME"
              type="text"
              id="REGIME"
              name="REGIME"
              class="obr ss"
              maxlength="3"
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <div class="mt-4 d-flex ga-2">
          <input
            v-model="state.edtSearch"
            type="text"
            placeholder="F1 - Buscar"
            :disabled="state.pnSearch"
            @keydown.enter.prevent="actions.search()"
            @keydown.arrow-down="state.gridPrincipal.focus(0)"
            id="edtSearch"
            class="ss"
          />

          <v-btn
            :disabled="state.pnSearch"
            size="30"
            color="primary"
            @click="actions.search()"
            icon="mdi-magnify"
          />
        </div>
      </div>

      <v-overlay
        :model-value="state.loading"
        class="align-center justify-center"
        persistent
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="50"
        ></v-progress-circular>
      </v-overlay>

      <div
        id="gridPrincipal"
        class="mt-4"
      ></div>

      <div
        id="pnBotoes"
        class="mt-4"
        style="text-align: center"
      ></div>
    </v-card>

    <div id="pnCodigoTela">Sociedade</div>
  </v-container>
</template>

<style scoped>
.ss {
  margin-right: 5px;
  margin-top: 1px;
}

.mt-4 {
  margin-top: 16px;
}
</style>
<v-row class="mt-n1">