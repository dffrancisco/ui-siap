<script setup lang="ts">
import { defineProps } from "vue";
import { iItemOrcamento } from "../interface";

const emit = defineEmits(["abrirModal"]);

const { produto } = defineProps<{ produto: iItemOrcamento }>();

function emitirEvento(tipo: string, props: iItemOrcamento) {
  emit("abrirModal", tipo, props);
}
</script>
<template>
  <div class="container bg-grey-lighten-4 d-flex justify-space-between align-center mt-2">
    <div class="d-flex flex-column ga-2">
      <div class="d-flex ga-5">
        <div
          class="card_estilo_valor border border-grey-lighten-4 bg-white d-flex justify-center align-center text-subtitle-1"
        >
          <span>{{ produto.NUM_FABRICANTE }}</span>
        </div>
        <div class="d-flex align-center">
          <span class="mr-1">Qtd:</span>
          <div
            class="card_estilo_valor border border-grey-lighten-4 bg-white d-flex justify-center align-center text-subtitle-1"
          >
            <span>{{ produto.QUANTIDADE }}</span>
          </div>
        </div>
      </div>
      <label class="font-weight-bold">{{ produto.DESC_PRODUTO }}</label>
      <div class="d-flex ga-5">
        <label class=""
          >Carro: <span class="font-weight-bold"> {{ produto.CARRO }}</span></label
        >
        <label
          >Marca: <span class="font-weight-bold">{{ produto.MARCA }}</span></label
        >
      </div>
    </div>
    <div class="d-flex flex-column d-flex justify-space-between ga-2">
      <div class="d-flex justify-space-between">
        <label
          >Endereço:
          <span class="font-weight-bold">
            {{ produto.END_ESTOQUE === "" ? "Não possui" : produto.END_ESTOQUE }} / {{ produto.END_EXCESSO }}
          </span></label
        >
        <v-icon
          class="ml-4"
          @click="emitirEvento('endEstoque', produto)"
          >mdi-pencil-outline</v-icon
        >
      </div>
      <div class="d-flex justify-space-between align-center">
        <label class="mr-2">Quantidade atual:</label>
        <div class="card_quantidade_atual text-center border border-blue-lighten-5 bg-blue-lighten-5 rounded-lg">
          <span class="font-weight-bold">{{ produto.QUANTIDADE_ESTOQUE }}</span>
        </div>
        <v-icon
          class="ml-4"
          @click="emitirEvento('quantidade', produto)"
          >mdi-pencil-outline</v-icon
        >
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  padding: 10px 20px;
  border-radius: 10px;
}
.card_estilo_valor {
  height: 20px;
  padding: 0px 5px;
}
.card_quantidade_atual {
  width: 20px;
}
.container_quantidade {
  width: 80px !important;
}
</style>
