<script setup lang="ts">
import { nextTick } from "vue";
import { state, actions } from "./bloquearCliente";
import modalCliente from "./components/modalCliente.vue";
import modalBloquearCliente from "./components/modalBloquearCliente.vue";

nextTick(async () => {
  actions.init();
});
</script>

<template>
  <v-container>
    <title>Bloquear Cliente</title>
    <v-card
      class="pa-5"
      style="width: 700px; margin: 0 auto"
    >
      <div class="pb-2">
        <v-row>
          <v-col cols="3">
            <span>CNPJ</span>
            <input
              type="button"
              v-model="state.dbClienteSelecionado.CGC_CLIENTE"
              :class="{'cliente-block' : state.btnBlockDisabled}"
              class="ss"
              name="CGC_CLIENTE"
              id="CGC_CLIENTE"
              @click="actions.modalClienteOpen"
              style="text-align: start;"
            />
          </v-col>
          <v-col cols="8">
            <span>Razão Social</span>
            <input
              type="button"
              v-model="state.dbClienteSelecionado.NOME"
              :class="{'cliente-block' : state.btnBlockDisabled}"
              class="ss"
              name="NOME"
              id="NOME"
              @click="actions.modalClienteOpen"
              style="text-align: start;"
            />
          </v-col>
          <v-btn
            style="margin-top: 20px"
            icon="mdi-magnify"
            color="blue"
            size="small"
            @click="actions.modalClienteOpen"
          >
          </v-btn>
        </v-row>
      </div>

      <div id="gridBloqueioCliente"></div>

      <div class="btn-block">
        <v-btn
          prepend-icon="mdi-checkbox-marked-circle"
          color="#3C8DBC"
          size="small"
          :disabled="state.btnUnlockDisabled"
        >
          Desbloquear
        </v-btn>
        <v-btn
          prepend-icon="mdi-cancel"
          color="#E43A3A"
          size="small"
          :disabled="state.btnBlockDisabled"
          @click="actions.modalBloquearClienteOpen"
        >
          Bloquear
        </v-btn>
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
        >
        </v-progress-circular>
      </v-overlay>
    </v-card>
    <div id="pnCodigoTela">BLOQUEAR_CLIENTE</div>
  </v-container>

  <div
    id="modalCliente"
    style="display: none"
    title="Clientes"
  >
    <modalCliente
      @cancelar="actions.modalClienteClose"
      @clienteSelecionado="actions.selecionarCliente"
    />
  </div>

  <div
    id="modalBloquearCliente"
    style="display: none"
    title="Observação"
  >
    <modalBloquearCliente
      @cancelar="actions.modalBloquearClienteClose"
    />
  </div>
</template>

<style scoped>
  .btn-block {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding-top: 10px;
  }

  .cliente-block {
    color: red;
  }
</style>
