<script setup lang="ts">
import { actions, state } from "./favorecidos";
import { onMounted, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    document.getElementById("edtSearch").focus();
    event.preventDefault();
    event.stopPropagation();
  }
});

onMounted(async () => {
  actions.init();
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});

const vinculoMap = {
  AD: "Administrativo",
  OP: "Operacional",
  RH: "Pessoal",
};
</script>

<template>
  <v-container>
    <title>Gerenciar Clientes</title>
    <v-card
      width="700"
      class="pa-5 ma-auto"
    >
      <div id="pnCampos">
        <v-row class="mt-n1">
          <v-col cols="6"
            ><span>Nome do Favorecido</span>
            <input
              v-model="state.dbFavorecido.NM_FAVORECIDO"
              type="text"
              id="NM_FAVORECIDO"
              name="NM_FAVORECIDO"
              class="obr ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="6">
            <span>Tipo de Vínculo</span>
            <select
              v-model="state.dbFavorecido.TP_VINCULO"
              id="TP_VINCULO"
              name="TP_VINCULO"
              class="obr ss"
            >
              <option
                v-for="(value, key) in vinculoMap"
                :key="key"
                :value="key"
              >
                {{ value }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col cols="6">
            <span>Nome da Matriz</span>
            <input
              v-model="state.dbFavorecido.NM_MATRIZ"
              type="text"
              id="NM_MATRIZ"
              name="NM_MATRIZ"
              class="obr ss"
              maxlength="60"
              autocomplete="off"
              v-mask="0"
            />
          </v-col>
          <v-col cols="3">
            <span>CNPJ</span>
            <input
              v-model="state.dbFavorecido.NR_CNPJ"
              type="text"
              id="NR_CNPJ"
              name="NR_CNPJ"
              class="obr ss"
              maxlength="18"
              v-mask="'##.###.###/####-##'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>CPF</span>
            <input
              v-model="state.dbFavorecido.NR_CPF"
              type="text"
              id="NR_CPF"
              name="NR_CPF"
              class="obr ss"
              maxlength="14"
              v-mask="'###.###.###-##'"
              autocomplete="off"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col cols="3">
            <span>Banco</span>
            <input
              v-model="state.dbFavorecido.CD_BANCO"
              type="text"
              id="CD_BANCO"
              name="CD_BANCO"
              class="obr ss"
              maxlength="5"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Agência</span>
            <input
              v-model="state.dbFavorecido.CD_AGENCIA"
              type="text"
              id="CD_AGENCIA"
              name="CD_AGENCIA"
              class="obr ss"
              maxlength="10"
              v-mask="'####-#'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Nº da Conta</span>
            <input
              v-model="state.dbFavorecido.NR_CONTA"
              type="text"
              id="NR_CONTA"
              name="NR_CONTA"
              class="obr ss"
              maxlength="15"
              v-mask="'#####-#'"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Operação</span>
            <input
              v-model="state.dbFavorecido.CD_OPERACAO"
              type="text"
              id="CD_OPERACAO"
              name="CD_OPERACAO"
              class="obr ss"
              maxlength="3"
              autocomplete="off"
            />
          </v-col>
        </v-row>

        <div class="mt-2 d-flex ga-2">
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
        class="mt-2"
      ></div>

      <div
        id="pnBotoes"
        class="mt-2"
        style="text-align: center"
      ></div>
    </v-card>

    <div id="pnCodigoTela">Favorecidos</div>
  </v-container>
</template>

<style scoped>
.ss {
  margin-right: 5px;
  margin-top: 1px;
}
</style>
