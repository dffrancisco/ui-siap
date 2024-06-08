<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions } from "./notificacoes";

nextTick(() => {
  actions.init();
});
</script>

<template>
  <v-container>
    <v-card
      width="700"
      style="margin: 0 auto"
      class="pa-5"
    >
      <div id="pnCampos">
        <v-row>
          <v-col>
            <span>Título</span>
            <input
              v-model="state.dbNotificacao.titulo"
              type="text"
              name="titulo"
              id="titulo"
              class="ss obr"
              maxlength="60"
              style="text-transform: none"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span>Descrição</span>
            <textarea
              v-model="state.dbNotificacao.descricao"
              type="text"
              name="descricao"
              id="descricao"
              class="ss obr"
              maxlength="255"
              rows="5"
              style="text-transform: none"
            ></textarea>
          </v-col>
        </v-row>
      </div>
      <v-row>
        <v-col cols="3">
          <v-checkbox
            v-model="state.checkboxNotificacoesInativadas"
            color="primary"
            label="Exibir Inativos"
            @update:model-value="actions.showNotificacoesInativas"
          />
        </v-col>
        <v-col>
          <div class="d-flex justify-end my-2">
            <input
              type="text"
              style="margin: 5px 0 5px"
              autofocus
              placeholder="F1 - Localizar"
              id="edtSearch"
              class="ss"
            />
            <v-btn
              size="small"
              class="ml-2 mt-1 elevation-0"
              color="primary"
            >
              Localizar
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <div id="gridNotificacoes"></div>

      <div
        id="pnBotoes"
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
        ></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-container>
</template>
