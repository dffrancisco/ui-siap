<script setup lang="ts">
import { nextTick, onUnmounted } from "vue";
import { state, actions } from "./cargos";
import { useEventListener } from "@vueuse/core";

nextTick(async () => {
  actions.init();
});

const eventListener = useEventListener(document, "keydown", async (event) => {
  if (event.key === "F1") {
    state.edtSearch.select();
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
    <title>Cargos</title>
    <v-card
      class="pa-5"
      style="max-width: 900px; margin: 0 auto"
    >
      <div id="camposGridCargos">
        <v-row>
          <v-col cols="6">
            <span>Descrição</span>
            <input
              type="text"
              v-model="state.dbCargo.DESCRICAO"
              class="obr ss"
              name="DESCRICAO"
              id="DESCRICAO"
              maxlength="30"
            />
          </v-col>
          <v-col cols="4">
            <span>Tipo de Cargo</span>
            <select
              v-model="state.dbCargo.TIPO"
              name="TIPO"
              id="TIPO"
              class="obr ss"
            >
              <option
                v-for="(label, value) in state.tiposCargos"
                :key="value"
                :value="value"
              >
                {{ label }}
              </option>
            </select>
          </v-col>
          <v-col>
            <span>Salário</span>
            <input
              type="text"
              v-model.lazy="state.dbCargo.SALARIO"
              class="obr ss"
              name="SALARIO"
              id="SALARIO"
              v-money3="state.configVMoney"
            />
          </v-col>
        </v-row>
        <v-row class="mt-1">
          <v-col cols="3">
            <v-checkbox
              v-model="state.isChecked"
              label="Exibir Inativos"
              color="blue"
              :disabled="state.toggleDisabled"
              @click="actions.checkboxClicked"
            >
            </v-checkbox>
          </v-col>
          <v-col>
            <div class="d-flex justify-end my-2">
              <input
                type="text"
                style="margin: 5px 0 5px"
                autofocus
                placeholder="F1 - Localizar"
                :disabled="state.pnSearch"
                @keydown.enter="actions.searchCargos()"
                @keyup.arrow-down="state.gridCargos.focus(0)"
                id="edtSearch"
                class="ss"
              />
              <v-btn
                :disabled="state.pnSearch"
                size="small"
                class="ml-2 mt-1 elevation-0"
                color="primary"
                @click="actions.searchCargos()"
              >
                Localizar
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <div id="gridCargos"></div>

      <div 
        id="btnGridCargos"
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
        >
        </v-progress-circular>
      </v-overlay>
    </v-card>
    <div id="pnCodigoTela">CADASTRO_CARGOS</div>
  </v-container>
</template>
