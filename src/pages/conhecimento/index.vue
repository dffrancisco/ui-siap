<script setup lang="ts">
import { actions, state } from "./conhecimento";
import { configVMoney } from "../../constants/constants";
import { onMounted } from "vue";

onMounted(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      width="700"
      class="pa-5 ma-auto"
    >
      <div id="pnCampos">
        <v-row>
          <v-col cols="2">
            <span>Código</span>
            <input
              v-model="state.dbConhecimento.ID_CONHECIMENTO"
              type="text"
              id="ID_CONHECIMENTO"
              name="ID_CONHECIMENTO"
              class="obr ss"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="8">
            <span>Descrição</span>
            <input
              v-model="state.dbConhecimento.DESCRICAO"
              type="text"
              id="DESCRICAO"
              name="DESCRICAO"
              class="obr ss"
              maxlength="30"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="2">
            <span>Valor</span>
            <input
              v-model.lazy="state.dbConhecimento.VALOR"
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

        <div class="mt-2 d-flex ga-2 pt-2 pb-2">
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

    <div id="pnCodigoTela">conhecimento</div>
  </v-container>
</template>
