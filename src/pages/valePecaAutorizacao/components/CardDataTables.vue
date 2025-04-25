<script lang="ts" setup>
import utils from "@/ts/utils";
import { iOrcamentoItem, iValeFuncionario } from "../interfaces";

const props = defineProps({
  valesFuncionario: {
    type: Array as () => iValeFuncionario[],
    default: [],
  },
  itemsOrc: {
    type: Array as () => iOrcamentoItem[],
    default: [],
  },
});

const headerTableVales = [
  { key: "NUM_ORCAMENTO", title: "N° Orç.", align: "center" },
  {
    key: "DATA",
    title: "Data",
    align: "center",
    value: (item) => utils.dataBrasil(item.DATA),
  },
  { key: "VALOR", title: "Valor", align: "center", value: (item) => utils.formatValor(item.VALOR) },
  { key: "DIV", title: "Parcela", align: "center" },
  { key: "QUITADO", title: "Quitado", align: "center" },
];

const headerTablePecasOrc = [
  { key: "NUM_FABRICANTE", width: "100", title: "N° Fab.", align: "center" },
  { key: "DESC_PRODUTO", title: "Descrição", align: "center" },
  { key: "QTO", title: "Qtd.", align: "center" },
  { key: "VALOR", title: "Valor", align: "center", value: (item) => utils.formatValor(item.VALOR) },
  {
    key: "VALOR_TOTAL",
    title: "Valor Total",
    align: "center",
    value: (item) => utils.formatValor(item.VALOR_TOTAL),
  },
];
</script>

<template>
  <v-card
    variant="outlined"
    color="grey-darken-1"
    class="d-flex flex-column flex-grow-1"
  >
    <v-card-item>
      <div>
        <span class="spanColor">Vales Feitos</span>
        <v-data-table-virtual
          :headers="headerTableVales"
          :items="props.valesFuncionario"
          fixed-header
          height="190"
        ></v-data-table-virtual>
      </div>
      <div class="mt-2">
        <span class="spanColor">Peças Orcamento</span>
        <v-data-table-virtual
          :headers="headerTablePecasOrc"
          :items="props.itemsOrc"
          height="190"
          fixed-header
        ></v-data-table-virtual>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.spanColor {
  color: black;
}
</style>
