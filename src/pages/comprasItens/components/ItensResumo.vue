<script setup lang="ts">
import { reactive } from "vue";
import { iCabecalhoCompra } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps({
  cabecalho: {
    type: Object as () => iCabecalhoCompra,
    default: {},
  },
});

const state = reactive({});
</script>

<template>
  <div class="detalhes-itens-resumo">
    <div class="d-flex justify-space-around ma-0">
      <div
        cols="3"
        class="d-flex flex-column align-center"
      >
        <span>Itens Vistos</span>
        <strong>5</strong>
      </div>
      <div
        cols="3"
        class="d-flex flex-column align-center"
      >
        <span>Itens Atual</span>
        <strong>5</strong>
      </div>
      <div
        cols="3"
        class="d-flex flex-column align-center"
      >
        <span>Qtd Itens</span>
        <strong>20</strong>
      </div>
      <div
        cols="3"
        class="d-flex flex-column align-center"
      >
        <span>Itens Restantes</span>
        <strong>15</strong>
      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 4px;
  height: 3px;
}
::-webkit-scrollbar-track-piece {
  background-color: #000;
}
::-webkit-scrollbar-thumb {
  height: 50px;
  background-color: #666;
  border-radius: 3px;
}
</style>

<style lang="scss" scoped>
.detalhes-itens-resumo {
  padding: 12px;
  width: 100%;
  background-color: var(--grey-900);
  border-radius: 8px;
}
</style>
