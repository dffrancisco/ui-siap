<script setup lang="ts">
import { dataBrasil, formatHoraSemOsSegundos, formatValor } from "@/ts/utils";
import { defineProps } from "vue";

const props = defineProps<{
  numOrcamento: number;
  statusOrcamento: string;
  dataOrcamento: string;
  horaOrcamento: string;
  valorOrcamento: number;
  nomeCliente: string;
  vendedor: string;
}>();
</script>
<template>
  <div class="d-flex flex-column ga-2 mt-3 border border-bg-grey-lighten-4 rounded-lg">
    <h1></h1>
    <div class="card_status_orcamento d-flex flex-column ga-3">
      <div class="d-flex justify-space-between w-100 align-center">
        <div class="d-flex ga-5">
          <div class="d-flex align-center">
            <v-icon>mdi-package-variant-closed</v-icon>
            <span class="font-weight-bold">#{{ props.numOrcamento }}</span>
          </div>
          <span
            class="status_orcamento"
            :class="props.statusOrcamento == 'CONFERIDO' ? 'bg-green-lighten-1' : 'bg-orange-lighten-1'"
            >{{ props.statusOrcamento === "CONFERIDO" ? "Conferido" : "Não conferido" }}</span
          >
        </div>
        <div class="d-flex ga-5">
          <span><v-icon class="mr-2">mdi-calendar-range</v-icon>{{ dataBrasil(props.dataOrcamento) }}</span>
          <span
            ><v-icon class="mr-2">mdi-clock-time-four-outline</v-icon
            >{{ formatHoraSemOsSegundos(props.horaOrcamento) }}</span
          >
          <span><v-icon class="mr-2">mdi-currency-usd</v-icon>R$ {{ formatValor(props.valorOrcamento) }}</span>
          <v-icon>mdi-plus</v-icon>
        </div>
      </div>
      <div class="d-flex ga-5">
        <label
          ><v-icon>mdi-account</v-icon> Solicitante:
          <span class="font-weight-bold">{{ props.nomeCliente }}</span></label
        >
        <label
          >Fornecedor: <span class="font-weight-bold">{{ props.vendedor }}</span></label
        >
      </div>
    </div>
    <div class="separador bg-grey-lighten-4"></div>
    <div class="card_slot">
      <slot></slot>
    </div>
    <div class="w-100 bg-grey-lighten-4">
      <div class="d-flex justify-space-between card_entrada_orcamento">
        <span>saasdsdasddsa</span>
        <v-btn
          class=""
          size="small"
          >Dar entrada</v-btn
        >
      </div>
    </div>
  </div>
</template>
<style scoped>
.card_status_orcamento {
  padding: 2px 20px;
}
.status_orcamento {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 2px 5px;
}
.separador {
  width: 100%;
  height: 1px;
}
.card_slot {
  padding: 5px 20px;
}
.card_entrada_orcamento {
  padding: 10px 20px;
}
</style>
