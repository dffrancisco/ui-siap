<script setup lang="ts">
import { actions, state } from "./cfop";
import { onMounted, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import { configVMoney } from "../../constants/constants";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    document.getElementById("edtSearch")?.focus();
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
</script>

<template>
  <v-container>
    <title>Gerenciar CFOP</title>
    <v-card
      max-width="700"
      class="pa-5 ma-auto"
    >
      <div id="pnCampos">
        <v-row>
          <v-col cols="5">
            <span>Descrição</span>
            <input
              v-model="state.dbCfop.DESCRICAO"
              type="text"
              id="DESCRICAO"
              name="DESCRICAO"
              class="obr ss"
              maxlength="40"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="2">
            <span>CFOP</span>
            <input
              v-model="state.dbCfop.CFOP"
              type="text"
              id="CFOP"
              name="CFOP"
              class="obr ss"
              maxlength="4"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="2">
            <span>UF</span>
            <input
              v-model="state.dbCfop.UF"
              type="text"
              id="UF"
              name="UF"
              v-mask="'SS'"
              class="obr ss"
              maxlength="2"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="3">
            <span>Valor</span>
            <input
              v-model.lazy="state.dbCfop.VALOR"
              :model-modifiers="{ number: true }"
              v-money3="configVMoney"
              id="VALOR"
              name="VALOR"
              class="obr ss"
              maxlength="15"
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
    <div id="pnCodigoTela">CFOP</div>
  </v-container>
</template>
