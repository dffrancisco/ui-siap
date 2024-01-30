<script setup lang="ts">
import { nextTick, onUnmounted } from "vue";
import { actions, state } from "./marcas";
import marcaSearch from './components/marcaSearch.vue'
import { useEventListener } from "@vueuse/core";

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.edtSearch.select();
    event.preventDefault();
    event.stopPropagation();
  }
});

nextTick(async () => {
 actions.init();

 state.edtSearch = <any>document.getElementById("edtSearch");
});

onUnmounted(() => {
  removeEventListener("keydown", eventListener);
});
</script>

<template>
  <V-container>
    <title>Cadastro de Marcas</title>
    <v-card class="pa-5" style="width: 700px; margin: 0 auto">
      <div id="pnCampos">
        <v-row>
          <v-col cols="6">
            <span>Descrição</span>
            <input
              maxlength="20"
              v-model="state.dbMarca.DESCRICAO"
              id="DESCRICAO"
              name="DESCRICAO"
              type="text"
              class="obr ss"
            />
          </v-col>
          <v-col cols="6">
            <span>Grupo Marca</span>
            <select
              v-model="state.dbMarca.GRUPO"
              name="GRUPO"
              id="GRUPO"
              class="obr ss"
            >
              <option
                v-for="group in state.dsMarca"
                :value="group.GRUPO"
                :data-id-marca-grupo="group.ID_MARCA_GRUPO"
              >
                {{ group.GRUPO }}
              </option>
            </select>
          </v-col>
        </v-row>
      </div>


      <marcaSearch />

      <div id="gridPrincipal"></div>
      <div id="pnBotoes" class="mt-3" style="text-align: center"></div>


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
  </V-container>
</template>
<style></style>