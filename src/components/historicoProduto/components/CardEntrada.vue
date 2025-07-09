<script lang="ts" setup>
import { dataBrasil, formatValor } from "@/ts/utils";
import { defineProps } from "vue";

const props = defineProps<{
  dataEntrada: string;
  numNotaFiscal: string;
  nomeFantasia: string;
  custo: number;
  qtoOld: number;
  quantidade: number;
  corDestaque: string;
}>();
</script>

<template>
  <v-card class="container_card">
    <div
      class="cor_identificacao"
      :class="props.corDestaque"
    ></div>
    <div class="container_informação_historico">
      <div class="d-flex justify-space-between">
        <v-text>{{ dataBrasil(props.dataEntrada) }}</v-text>
        <v-text class="codigo">#{{ props.numNotaFiscal }}</v-text>
      </div>
      <div class="d-flex flex-column mt-2">
        <v-text class="font-weight-bold nome">{{ props.nomeFantasia }}</v-text>
      </div>
      <div class="border mt-2"></div>
      <div class="d-flex justify-space-between mt-2">
        <v-text class="font-weight-bold"> {{ formatValor(props.custo) }} </v-text>
        <div>
          <v-text class="quantidade mr-1">QTD V: {{ props.qtoOld }}</v-text>
          <v-text class="quantidade">QTD: {{ props.quantidade }}</v-text>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.container_card {
  display: flex;
  margin: 0px 8px;
  min-height: 120px;
}
.cor_identificacao {
  min-width: 5px;
  height: auto;
}
.container_informação_historico {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 4px 8px;
}
.quantidade,
.codigo {
  background-color: #cfd8dc;
  border-radius: 5px;
  padding: 0 5px;
}
.nome {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
}
</style>
