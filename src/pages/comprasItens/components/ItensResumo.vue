<script setup lang="ts">
import { reactive } from "vue";

const props = defineProps({
  qtdItens: {
    type: Number,
    default: 0,
  },
  qtdItensVistos: {
    type: Number,
    default: 0,
  },
  itemAtual: {
    type: Number,
    default: 0,
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
        <span>Item Atual</span>
        <strong>{{ itemAtual }}</strong>
      </div>
      <div
        cols="3"
        class="d-flex flex-column align-center"
      >
        <span>Itens Vistos</span>
        <strong>{{ qtdItensVistos }}</strong>
      </div>
      <div
        cols="3"
        class="d-flex flex-column align-center"
      >
        <span>Qtd Itens</span>
        <strong>{{ qtdItens }}</strong>
      </div>
      <div
        cols="3"
        class="d-flex flex-column align-center"
      >
        <span>Itens Restantes</span>
        <strong>{{ qtdItens - qtdItensVistos }}</strong>
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
