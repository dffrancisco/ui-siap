<script setup lang="ts">
import { iCabecalhoCompra } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps({
  cabecalho: {
    type: Object as () => iCabecalhoCompra,
    default: {},
  },
});
</script>

<template>
  <div class="cabecalho">
    <div>
      <div>
        <span class="mr-1">Pedido:</span>
        <strong>{{ props.cabecalho.ID_COMPRAS }}</strong>
      </div>
      <div class="mt-2">
        <span class="mr-1">Data:</span>
        <strong>{{ utils.dataBrasil(props.cabecalho.DATA) }}</strong>
      </div>
    </div>
    <div>
      <div>
        <span class="mr-1">Qtd Itens:</span>
        <strong>{{ props.cabecalho.QTD_ITENS }}</strong>
      </div>
      <div class="mt-2">
        <span class="mr-1">Valor:</span>
        <strong>{{ utils.formatValor(props.cabecalho.VALOR) }}</strong>
      </div>
    </div>
    <div>
      <div>
        <span class="mr-1">Comprador:</span>
        <strong>{{ props.cabecalho.COMPRADOR }}</strong>
      </div>
      <div class="mt-2">
        <span class="mr-1">Marca:</span>
        <v-chip
          variant="outlined"
          color="blue"
          size="x-small"
          class="px-2 mr-1"
          >{{ props.cabecalho.MARCA_PRINCIPAL }}</v-chip
        >
        <v-chip
          variant="outlined"
          color="blue"
          size="x-small"
          class="px-2"
          >+{{ props.cabecalho.MARCAS.length }}</v-chip
        >
      </div>
    </div>
    <div class="cabecalho-obs">
      <span class="mr-1">Obs.:</span>
      <strong :title="props.cabecalho.OBS">{{ props.cabecalho.OBS }}</strong>
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
.cabecalho {
  width: 100%;
  background-color: var(--grey-900);
  padding: 12px;
  border-radius: 8px;
  color: var(--grey-100);
  display: flex;
  gap: 32px;
  height: 72px;
}

.cabecalho-obs {
  width: 50%;
  overflow: hidden;
  line-height: 15px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  strong {
    color: var(--danger-400);
  }
}
</style>
