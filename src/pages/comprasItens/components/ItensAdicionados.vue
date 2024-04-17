<script setup lang="ts">
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import { nextTick, reactive } from "vue";

const state = reactive({
  gridItensAdicionados: <ixGridCreate>{},
});

const actions = {
  init: () => {
    actions.initGrids();
  },
  initGrids: () => {
    state.gridItensAdicionados = new xGridV2.create({
      el: "#gridItensAdicionados",
      //@ts-ignore
      theme: "x-modern-dark",
      height: "370px",
      columns: {
        "Nº Fabricante": { dataField: "NUM_FABRICANTE" },
        Descrição: { dataField: "DESCRICAO" },
        Carro: { dataField: "NOME_CARRO" },
        Marca: { dataField: "NOME_MARCA" },
        Qtd: { dataField: "QTD", center: true },
        Custo: { dataField: "CUSTO", center: true },
      },
    });

    state.gridItensAdicionados.source([
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
      { DESCRICAO: "teste" },
    ]);
  },
};

nextTick(() => {
  actions.init();
});
</script>

<template>
  <div class="itens-adicionados">
    <div
      id="gridItensAdicionados"
      class="grid-itens-adicionados"
    ></div>
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
.itens-adicionados {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 792px;
  height: 100%;
  background-color: var(--grey-900);
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 8px;
}
</style>
