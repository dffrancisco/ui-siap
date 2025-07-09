<script lang="ts" setup>
import { dataBrasil } from "@/ts/utils";
import { defineProps } from "vue";

const props = defineProps<{
  dtDevolucao: any;
  numOrcamento: any;
  dtOrcamento: any;
  quantidade: number;
}>();
</script>

<template>
  <v-card class="container_card">
    <div class="cor_identificacao bg-green-darken-2"></div>
    <div class="container_informação_historico">
      <div class="d-flex justify-space-between">
        <v-text>{{ dataBrasil(props.dtDevolucao) }}</v-text>
        <v-text class="codigo">#{{ props.numOrcamento }}</v-text>
      </div>
      <div class="d-flex flex-column mt-2">
        <v-text>Data da venda:</v-text>
        <v-text class="font-weight-bold"> {{ dataBrasil(props.dtOrcamento) }}</v-text>
      </div>
      <div class="border mt-2"></div>
      <div class="d-flex justify-space-between mt-2">
        <v-text></v-text>
        <v-text class="quantidade">QTD: {{ props.quantidade }}</v-text>
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
  width: 5px;
}
.container_informação_historico {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 4px 8px;
}
.scroll {
  height: 100%;
  overflow: auto;
}
.scroll::-webkit-scrollbar {
  width: 10px;
  height: 20px;
  margin-top: 20px;
}
.scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}
.scroll::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.quantidade,
.codigo {
  background-color: #cfd8dc;
  border-radius: 5px;
  padding: 0 5px;
}
</style>
