<script setup lang="ts">
import { actions, state, eventListener } from "./gerirRamais";
import { onMounted, onUnmounted } from "vue";

onMounted(async () => {
  await actions.init();
  await actions.getSetores();
  window.addEventListener("keydown", eventListener);
});

onUnmounted(() => {
  window.removeEventListener("keydown", eventListener);
});
</script>

<template>
  <v-container>
    <title>Gerenciar Ramais</title>
    <v-card
      width="800"
      class="pa-5 ma-auto"
    >
      <div id="pnCampos">
        <v-row class="mt-n1">
          <v-col cols="6">
            <span>Loja</span>
            <select
              v-model="state.dbRamal.ID_SOCIEDADE"
              id="lojaSelect"
              name="lojaSelect"
              class="obr ss"
            >
              <option
                v-for="loja in state.lojas"
                :key="loja.ID_SOCIEDADE"
                :value="loja.ID_SOCIEDADE"
              >
                {{ loja.NOME }}
              </option>
            </select>
          </v-col>
          <v-col cols="6">
            <span>Setor</span>
            <select
              v-model="state.dbRamal.ID_SETOR"
              id="setorSelect"
              name="setorSelect"
              class="obr ss"
            >
              <option
                v-for="setor in state.setores"
                :key="setor.ID_SETOR"
                :value="setor.ID_SETOR"
              >
                {{ setor.NOME }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col cols="6">
            <span>Nome</span>
            <input
              v-model="state.dbRamal.NOME"
              type="text"
              id="nome"
              name="nome"
              class="obr ss"
              maxlength="60"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="6">
            <span>Ramal</span>
            <input
              v-model="state.dbRamal.RAMAL"
              type="text"
              id="ramal"
              name="ramal"
              class="obr ss"
              maxlength="4"
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
        class="mt-4 d-flex justify-center"
      >
      </div>
    </v-card>

    <div id="pnCodigoTela">Gerir Ramais</div>
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
