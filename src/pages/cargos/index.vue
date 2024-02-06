<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions } from "./cargos";

nextTick(async () => {
    actions.init();
});
</script>

<template>
  <v-container>
    <title>Cargos</title>
    <v-card
      class="pa-5"
      style="width: 700px; margin: 0 auto"
    >
      <div>
        <v-row>
          <v-col cols="9">
            <span>Descrição</span>
            <input
              type="text"
              v-model="state.cargo.DESCRICAO"
              class="obr ss"
              name="DESCRICAO"
              id="DESCRICAO"
              maxlength="30"
            />
          </v-col>
          <v-col>
            <span>Salário</span>
            <input
              type="text"
              v-model="state.cargo.SALARIO"
              class="obr ss"
              name="SALARIO"
              id="SALARIO"
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
              @change="state.isChecked != state.isChecked"
              @update:model-value="actions.search"
              @click="state.edtSearch.value = null"
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
                @keydown.enter="actions.search()"
                @keyup.arrow-down="state.gridCargos.focus(0)"
                id="edtSearch"
                class="ss"
              />
              <v-btn
                :disabled="state.pnSearch"
                size="small"
                class="ml-2 mt-1 elevation-0"
                color="primary"
                @click="actions.search()"
              >
                Localizar
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <div id="gridCargos"></div>
    </v-card>
    <div id="pnCodigoTela">CADASTRO_CARGOS</div>
  </v-container>
</template>
