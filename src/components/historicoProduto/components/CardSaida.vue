<script lang="ts" setup>
import { dataBrasil, formatValor } from "@/ts/utils";
import { defineProps, defineEmits } from "vue";

const emit = defineEmits(["modalSaida"]);

const props = defineProps<{
  dataVenda: string;
  orcamento: number;
  nomeCliente: string;
  vendedor: string;
  valorVenda: number;
  quantidade: number;
}>();
</script>

<template>
  <v-card
    class="container_card"
    @click="emit('modalSaida')"
  >
    <div class="d-flex w-100">
      <div class="cor_identificacao bg-pink-darken-1"></div>
      <div class="container_informação_historico">
        <div class="d-flex justify-space-between">
          <v-text>{{ dataBrasil(props.dataVenda) }}</v-text>
          <v-text class="codigo">#{{ props.orcamento }}</v-text>
        </div>
        <div class="d-flex flex-column mt-2">
          <v-text class="font-weight-bold nome">{{ props.nomeCliente }}</v-text>
          <v-text>{{ props.vendedor }}</v-text>
        </div>
        <div class="border mt-2"></div>
        <div class="d-flex justify-space-between mt-2">
          <v-text class="font-weight-bold"> {{ formatValor(props.valorVenda) }} </v-text>
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
