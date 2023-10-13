<script lang="ts" setup>
import globalActions from "@/store/globalActions";
import { actions, state } from "../descontoOrcamento";
import { nextTick } from "vue";

nextTick(() => {
  state.edtEstoque = document.getElementById("edtEstoque");
});
let imgSrc = () => {
  return globalActions.getProdutoThumb(state.produtoSelected.COD_PRODUTO, 200);
};
</script>

<template>
  <v-row class="fontsAdapt mb-n3">
    <v-col cols="3">
      <div class="mt-n3">
        <img :src="imgSrc()" class="rounded-lg" style="height: 100px" />
      </div>
    </v-col>
    <v-col cols="9">
      <div>{{ state.produtoSelected.DESC_PRODUTO }}</div>
      <div>
        <v-chip>{{ state.produtoSelected.NUM_FABRICANTE }}</v-chip>
        <v-chip class="mx-5">{{ state.produtoSelected.CARRO }}</v-chip>
        <v-chip>{{ state.produtoSelected.MARCA }}</v-chip>
      </div>
      <div>
        <span>
          Quantidade: <b>{{ state.produtoSelected.QTO }}</b>
        </span>
      </div>
    </v-col>
  </v-row>

  <v-divider></v-divider>

  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="4" class="text-center">
      <div>Estoque Atual</div>
      <v-chip size="x-large" color="primary">
        {{ state.produtoSelected.QTD_ESTOQUE }}
      </v-chip></v-col
    >
    <v-col cols="4">
      <v-text-field
        style="height: 50px"
        id="edtEstoque"
        v-model="state.produtoSelected.QTO"
        label="Novo Estoque"
        class="inputRight mt-4"
        :clearable="false"
        @keypress.enter="actions.fnUpdateProduto()"
        @focus.native="$event.target.select()"
      ></v-text-field
    ></v-col>
    <v-col cols="2"></v-col>
  </v-row>

  <!-- <div class="ajusteModal pa-2 mt-3">
    <v-row class="mb-n8">
      <v-col cols="3">
        <v-text-field
          v-model="state.produtoSelected.NUM_FABRICANTE"
          label="Nº Fabricante"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="state.produtoSelected.DESC_PRODUTO"
          label="Descrição Produto"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="state.produtoSelected.CARRO"
          label="Carro"
          readonly
        ></v-text-field
      ></v-col>
    </v-row>

   
  </div> -->
</template>

<style>
#pnUpdateProduto .xModal-modal-content {
  overflow-y: hidden;
}
</style>
