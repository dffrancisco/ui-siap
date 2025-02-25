<script setup lang="ts">
import { state, actions } from "./baixaManualBoleto";
import ModalClienteFaturado from "./components/ModalClienteFaturado.vue";
</script>
<template>
  <v-container>
    <v-card
      :max-width="900"
      class="mx-auto pa-4"
    >
      <v-row>
        <v-col cols="11">
          <v-text-field
            label="Cliente Faturado"
            ref="inputClienteFaturado"
            @click="state.modalClienteFaturadoOpened = true"
          ></v-text-field
        ></v-col>
        <v-col cols="1">
          <div class="d-flex align-center">
            <v-btn
              icon="mdi-magnify"
              size="39"
              color="primary"
              @click="state.modalClienteFaturadoOpened = true"
            />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>

  <!-- modalClienteFaturado -->
  <v-dialog
    v-model="state.modalClienteFaturadoOpened"
    max-width="900"
  >
    <ModalClienteFaturado
      @selecionarClienteFaturado="actions.buscarOrcamentosEBoletos"
      @closeModalClienteFaturado="state.modalClienteFaturadoOpened = false"
    />
  </v-dialog>
</template>
