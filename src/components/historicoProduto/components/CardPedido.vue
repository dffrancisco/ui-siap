<script lang="ts" setup>
import { dataBrasil } from "@/ts/utils";
import { defineProps } from "vue";

const props = defineProps<{
  data: string;
  idCompra: number;
  comprador: string;
  quantidade: number;
}>();
</script>

<template>
  <v-card class="container_card">
    <div class="cor_identificacao bg-orange-darken-2"></div>
    <div class="container_informação_historico">
      <div class="d-flex justify-space-between">
        <v-text>{{ dataBrasil(props.data) }}</v-text>
        <v-text class="codigo">#{{ props.idCompra }}</v-text>
      </div>
      <div class="d-flex flex-column mt-2">
        <v-text>Comprador: </v-text>
        <v-text class="font-weight-bold">{{ props.comprador }} </v-text>
      </div>
      <div class="border mt-2"></div>
      <div class="d-flex justify-end mt-2">
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
</style>
