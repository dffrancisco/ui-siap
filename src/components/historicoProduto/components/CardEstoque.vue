<script lang="ts" setup>
import { dataBrasil, formatHora } from "@/ts/utils";
import { defineProps } from "vue";

const props = defineProps<{
  dhLog: string;
  estoquista: string;
  conteudo: string;
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
        <v-text>{{ dataBrasil(props.dhLog) }}</v-text>
        <v-text class="codigo">{{ formatHora(props.dhLog) }}</v-text>
      </div>
      <div class="d-flex flex-column mt-2">
        <v-text class="font-weight-bold">{{ props.estoquista }}</v-text>
        <v-text class="text-subtitle-2">{{ props.conteudo }}</v-text>
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
