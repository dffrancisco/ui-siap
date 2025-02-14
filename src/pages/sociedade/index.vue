<script setup lang="ts">
import { actions, state } from "./sociedade";
import ModalSociedade from "./components/ModalSociedade.vue";
import { onMounted } from "vue";

onMounted(async () => {
  await actions.init();
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
          <v-col cols="5">
            <span>Sociedade</span>
            <input
              v-model="state.dbSociedade.NOME"
              type="text"
              id="ID_CLIENTE"
              name="ID_CLIENTE"
              class="obr ss"
              maxlength="60"
              autocomplete="off"
              :style="{ width: '105%' }"
            />
          </v-col>
          <v-col
            cols="1"
            class="d-flex align-end"
          >
            <v-btn
              title="Pesquisar Clientes"
              id="btnGetClientes"
              size="30"
              color="primary"
              @click="state.modalClienteOpened = true"
              :disabled="!state.desativarInputs"
              icon="mdi-magnify"
            />
          </v-col>
          <v-col cols="">
            <span>CNPJ</span>
            <input
              v-model="state.dbSociedade.CNPJ"
              type="text"
              id="CNPJ"
              name="CNPJ"
              class="obr ss"
              maxlength="23"
              v-mask="'##.###.###/####-##'"
              autocomplete="off"
              :style="{ width: '105%' }"
            />
          </v-col>
          <v-col cols="2">
            <span>ID Empresa</span>
            <input
              v-model="state.dbSociedade.ID_EMPRESA"
              type="text"
              id="ID_EMPRESA"
              name="ID_EMPRESA"
              class="obr ss"
              autocomplete="off"
              v-mask="0"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col cols="6">
            <span>Caminho Servidor</span>
            <input
              v-model="state.dbSociedade.CAMINHO_SERVIDOR"
              type="text"
              id="CAMINHO_SERVIDOR"
              name="CAMINHO_SERVIDOR"
              class="ss"
              maxlength="200"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="6">
            <span>Endereço Host</span>
            <input
              v-model="state.dbSociedade.HOST"
              type="text"
              id="HOST"
              name="HOST"
              class="ss"
              maxlength="200"
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
              class="ss"
              maxlength="200"
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
              maxlength="15"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Gera SPED</span>
            <select
              v-model="state.dbSociedade.GERA_SPED"
              id="GERA_SPED"
              name="GERA_SPED"
              class="obr ss"
            >
              <option
                v-for="(value, key) in state.spedOptions"
                :key="key"
                :value="key"
              >
                {{ value }}
              </option>
            </select>
          </v-col>
          <v-col cols="3">
            <span>Regime</span>
            <select
              v-model="state.dbSociedade.REGIME"
              id="REGIME"
              name="REGIME"
              class="obr ss"
            >
              <option
                v-for="(value, key) in state.regimeOptions"
                :key="key"
                :value="key"
              >
                {{ value }}
              </option>
            </select>
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

  <v-dialog
    v-model="state.modalClienteOpened"
    max-width="900"
  >
    <ModalSociedade
      @selecionarCliente="actions.salvarClienteSelecionadoNaState"
      @closeModalCliente="state.modalClienteOpened = false"
    />
  </v-dialog>
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
