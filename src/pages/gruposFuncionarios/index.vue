<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions } from "./gruposFuncionarios";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    {{ state.dbGrupo }}
    <v-card
      height="400"
      width="700"
      class="pa-5"
      style="margin: 0 auto"
    >
      <div
        id="pnCampos"
        class="pb-5"
      >
        <div>
          <span>Nome</span>
          <input
            type="text"
            v-model="state.dbGrupo.NOME"
            class="obr ss"
            id="NOME"
            name="NOME"
            maxlength="30"
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
          size="64"
        ></v-progress-circular>
      </v-overlay>

      <div id="gridGruposFuncionarios"></div>

      <div
        id="pnBotoes"
        class="mt-3"
        style="text-align: center"
      ></div>

      <div
        id="modalAddFuncionariosGrupo"
        style="display: none"
      >
      </div>
    </v-card>
    <div id="pnCodigoTela">GRUPOS_FUNCIONARIOS</div>
  </v-container>
</template>
