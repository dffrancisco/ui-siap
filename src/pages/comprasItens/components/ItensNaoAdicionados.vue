<script setup lang="ts">
import { reactive } from "vue";
import { iProduto, iTipoVisualizacao } from "../interfaces";
import { MAP_COL_PRODUTO } from "../constants/constants";
import { formatValor } from "@/ts/utils";
import { getColorCurva } from "../services/comprasItens.service";

const props = defineProps({
  produto: {
    type: Object as () => iProduto,
    default: {},
  },
  exibirIconeAvancar: {
    type: Boolean,
    required: true,
  },
  exibirIconeVoltar: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["avancarItem", "voltarItem"]);

const state = reactive({
  tipoVisualizacao: <iTipoVisualizacao>"unica",
});
</script>

<template>
  <div class="item">
    <div class="item-info">
      <v-row>
        <v-col
          cols="11"
          class="d-flex flex-column"
        >
          <span>Descrição</span>
          <strong class="item-info-value">{{ produto[MAP_COL_PRODUTO.DESC_PRODUTO] || "-" }}</strong>
        </v-col>
        <v-col
          v-if="produto[MAP_COL_PRODUTO.FOTO] == 'S'"
          cols="1"
          class="d-flex align-center"
          title="Ver foto"
        >
          <v-icon>mdi mdi-camera</v-icon>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col
          cols="3"
          class="d-flex flex-column"
        >
          <span>Carro</span>
          <strong class="item-info-value">{{ produto[MAP_COL_PRODUTO.DESCRICAO_CARRO] }}</strong>
        </v-col>
        <v-col
          cols="3"
          class="d-flex flex-column"
        >
          <span>Nº Fabricante</span>
          <strong class="item-info-value">{{ produto[MAP_COL_PRODUTO.NUM_FABRICANTE] }}</strong>
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column"
        >
          <span>Nº Fabricante 2</span>
          <strong class="item-info-value">{{ produto[MAP_COL_PRODUTO.NUM_FABRICANTE2] || "-" }}</strong>
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column"
        >
          <span>Curva G</span>
          <strong
            class="item-info-value"
            :style="{ color: getColorCurva(produto[MAP_COL_PRODUTO.CURVA_ABC_G]) }"
            >{{ produto[MAP_COL_PRODUTO.CURVA_ABC_G] }}</strong
          >
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column"
        >
          <span>Curva M</span>
          <strong
            class="item-info-value"
            :style="{ color: getColorCurva(produto[MAP_COL_PRODUTO.CURVA_ABC_M]) }"
            >{{ produto[MAP_COL_PRODUTO.CURVA_ABC_M] }}</strong
          >
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col
          cols="4"
          class="d-flex flex-column py-5"
        >
          <span>Marca</span>
          <strong class="item-info-value">{{ produto[MAP_COL_PRODUTO.DESCRICAO_MARCA] }}</strong>
        </v-col>
        <v-col
          cols="2"
          class="py-4"
        >
          <div class="d-flex flex-column item-info-media px-2 py-1">
            <span>Média</span>
            <strong class="item-info-value">000</strong>
          </div>
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column py-5"
        >
          <span>Qtd. Atual</span>
          <strong class="item-info-value">{{ produto[MAP_COL_PRODUTO.QUANTIDADE] }}</strong>
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column py-5"
        >
          <span>Custo</span>
          <strong class="item-info-value">{{ formatValor(produto[MAP_COL_PRODUTO.CUSTO]) }}</strong>
        </v-col>
        <v-col
          cols="2"
          class="d-flex flex-column py-5"
        >
          <span>Venda</span>
          <strong class="item-info-value">{{ formatValor(produto[MAP_COL_PRODUTO.VENDA]) }}</strong>
        </v-col>
      </v-row>
    </div>
    <div class="item-paginacao">
      <div>
        <v-icon
          v-if="exibirIconeVoltar"
          @click="emit('voltarItem')"
          >mdi mdi-arrow-left</v-icon
        >
      </div>
      <div>
        <v-icon
          v-if="exibirIconeAvancar"
          @click="emit('avancarItem')"
          >mdi mdi-arrow-right</v-icon
        >
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
.item {
  background-color: var(--grey-900);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.item-info {
  padding: 12px;
  flex-grow: 1;
  font-size: 14px;
  line-height: 16px;
  font-weight: 300;
}

.item-info-value {
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
}

.item-info-media {
  border: 1px solid var(--grey-800);
  border-radius: 4px;
}

.item-info-media .item-info-value {
  color: var(--success-300);
}

.item-paginacao {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
}
</style>
