<script setup lang="ts">
import { state, options, actions } from "./conferenciaDeCaixa";
import { onMounted } from "vue";

onMounted(() => {
  actions.init();
});
</script>
<template>
  <v-container>
    <v-card
      :width="900"
      class="ma-auto pa-4"
    >
      <v-row>
        <v-col cols="3">
          <v-text-field
            v-model="state.data"
            label="Data"
            type="date"
            :clearable="false"
          >
          </v-text-field
        ></v-col>
        <v-col cols="1">
          <div class="d-flex align-center">
            <v-btn
              icon="mdi-magnify"
              size="39"
              color="primary"
              @click="actions.init"
            />
          </div>
        </v-col>
      </v-row>

      <div
        v-if="!state.mdcAberto"
        class="text-center pa-4"
      >
        <v-alert
          type="warning"
          color="primary"
          prominent
          class="mb-4"
        >
          O Movimento Diário de Consumo (MDC) está fechado!
        </v-alert>
        <v-btn
          color="primary"
          size="large"
          @click="actions.abrirMDC"
        >
          Abrir MDC
        </v-btn>
      </div>

      <div
        v-else
        style="padding-top: 20px"
      >
        <v-chip-group
          v-model="state.selectedOption"
          color="primary"
        >
          <v-chip
            v-for="option in options"
            :key="option.value"
            class="vchip"
            style="margin-left: 5px; font-size: 16px; width: 150px"
            :value="option.value"
            :class="{ 'selected-chip': state.selectedOption === option.value }"
          >
            {{ option.label }}
          </v-chip>
        </v-chip-group>
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
    <div id="pnCodigoTela">conferenciaDeCaixa</div>
  </v-container>
</template>

<style scoped>
.selected-chip {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

.vchip {
  display: flex !important;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 8px !important;
}
</style>
