<script setup lang="ts">
import utils from "@/ts/utils";
</script>

<template>
  <v-card
    class="d-flex flex-column flex-grow-1"
    variant="outlined"
    color="grey-darken-1"
  >
    <div class="text-black pa-2 d-flex flex-column flex-grow-1">
      <span>Informações</span>
      <div class="d-flex flex-column mt-2 text-body-2 ga-2">
        <div class="d-flex justify-space-between">
          <strong>Devendo: </strong>
          <span>R$ {{ utils.formatValor(0) }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <strong>Última Parcela: </strong>
          <span>R$ {{ utils.formatValor(0) }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <strong>Parcelas Não Quitadas: </strong>
          <span>R$ {{ utils.formatValor(0) }}</span>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <div>
        <span>N° Orçamento</span>
        <div class="d-flex align-center ga-2">
          <v-text-field density="compact"></v-text-field>
          <v-btn
            color="primary"
            size="small"
            icon="mdi-magnify mdi-24px"
          ></v-btn>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <div>
        <span>Parcelamento</span>
        <v-select></v-select>
      </div>

      <v-divider class="my-2"></v-divider>

      <div class="d-flex flex-column text-body-2 ga-2">
        <div class="d-flex justify-space-between">
          <strong>Valor: </strong>
          <span>R$ {{ utils.formatValor(0) }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <strong>Valor Parcela: </strong>
          <span>R$ {{ utils.formatValor(0) }}</span>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <div class="d-flex pa-2 flex-column ga-4 flex-grow-1 justify-center">
        <v-btn
          size="small"
          color="primary"
          >liberar funcionário</v-btn
        >

        <v-btn
          size="small"
          color="primary"
          >liberar gerente</v-btn
        >
      </div>
    </div>
  </v-card>
</template>
