<script setup lang="ts">
import modalXAuthManager from "@/plugins/xAuthManager/index.vue";
import { actions, state } from "./recalcularDescontoLoja";
import { formatValor } from "@/ts/utils";

actions.init();
</script>

<template>
  <v-app id="card">
    <v-container
      class="d-flex justify-center align-center"
      style="height: 100vh"
    >
      <v-card
        class="cardePincipal cmx-auto pa-3 d-flex flex-column justify-center align-center"
        max-width="600"
      >
        <v-card-title class="text-h5 blue-grey-darken-1 white--text justify-center">
          Recalcular Desconto
        </v-card-title>

        <div
          class="d-flex justify-center align-center mt-5"
          style="width: 100%; max-width: 400px"
        >
          <v-text-field
            class="px-2 flex-grow-1"
            label="N° Orçamento"
            variant="outlined"
            density="compact"
            :hide-details="true"
            v-model="state.numOrcamento"
            @keypress.enter.stop="actions.getOrcamento"
          />

          <v-btn
            color="primary"
            class="ml-2"
            height="40"
            @click.prevent="actions.getOrcamento"
          >
            Recalcular
          </v-btn>
        </div>
      </v-card>

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
    </v-container>
  </v-app>
</template>

<style scoped>
.cardePincipal {
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  width: 100%;
  height: 300px;
}
</style>
