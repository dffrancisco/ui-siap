<script lang="ts" setup>
import utils from "@/ts/utils";

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
  { key: "NUM_FABRICANTE", width: "140", title: "N° Fab.", align: "center" },
  { key: "DESC_PRODUTO", width: "280", title: "Descrição", align: "center" },
  { key: "QTO", title: "Qtd.", align: "center" },
  { key: "VALOR", title: "Valor", align: "center", value: (item) => utils.formatValor(item.VALOR) },
  {
    key: "VALOR_TOTAL",
    title: "Valor Total",
    align: "center",
    value: (item) => utils.formatValor(item.VALOR_TOTAL),
  },
];

const testeVales = [
  {
    NUM_ORCAMENTO: 6122,
    DATA: "2025-04-10T03:00:00.000Z",
    VALOR: 246.99,
    DIV: "1/5",
    QUITADO: "NAO",
  },
  {
    NUM_ORCAMENTO: 6122,
    DATA: "2025-05-10T03:00:00.000Z",
    VALOR: 246.99,
    DIV: "2/5",
    QUITADO: "NAO",
  },
  {
    NUM_ORCAMENTO: 6122,
    DATA: "2025-06-10T03:00:00.000Z",
    VALOR: 246.99,
    DIV: "3/5",
    QUITADO: "NAO",
  },
  {
    NUM_ORCAMENTO: 6122,
    DATA: "2025-07-10T03:00:00.000Z",
    VALOR: 246.99,
    DIV: "4/5",
    QUITADO: "NAO",
  },
  {
    NUM_ORCAMENTO: 6122,
    DATA: "2025-08-10T03:00:00.000Z",
    VALOR: 246.99,
    DIV: "5/5",
    QUITADO: "NAO",
  },
];

const testePecas = [
  {
    COD_PRODUTO: 69455,
    DESC_PRODUTO: "ABRACADEIRA 9X11 SIMPLEX",
    VALOR: 4,
    QTO: 1,
    VALOR_TOTAL: 4,
    NUM_FABRICANTE: "911-",
  },
  {
    COD_PRODUTO: 67526,
    DESC_PRODUTO: "ABRACADEIRA 9X13 MICRO",
    VALOR: 5,
    QTO: 1,
    VALOR_TOTAL: 5,
    NUM_FABRICANTE: "913-",
  },
  {
    COD_PRODUTO: 67991,
    DESC_PRODUTO: "ABRACADEIRA 13X19 MICRO",
    VALOR: 5,
    QTO: 1,
    VALOR_TOTAL: 5,
    NUM_FABRICANTE: "1319-",
  },
  {
    COD_PRODUTO: 67992,
    DESC_PRODUTO: "ABRACADEIRA 14X22 MICRO",
    VALOR: 5,
    QTO: 1,
    VALOR_TOTAL: 5,
    NUM_FABRICANTE: "1422-",
  },
  {
    COD_PRODUTO: 67525,
    DESC_PRODUTO: "ABRACADEIRA 19X27 MICRO",
    VALOR: 10,
    QTO: 1,
    VALOR_TOTAL: 10,
    NUM_FABRICANTE: "1927-",
  },
  {
    COD_PRODUTO: 67993,
    DESC_PRODUTO: "ABRACADEIRA 22X32 MICRO",
    VALOR: 10,
    QTO: 1,
    VALOR_TOTAL: 10,
    NUM_FABRICANTE: "2232",
  },
  {
    COD_PRODUTO: 67995,
    DESC_PRODUTO: "ABRACADEIRA 32X44 PRESIL",
    VALOR: 8,
    QTO: 1,
    VALOR_TOTAL: 8,
    NUM_FABRICANTE: "3244--",
  },
  {
    COD_PRODUTO: 67996,
    DESC_PRODUTO: "ABRACADEIRA 38X51 PRESIL",
    VALOR: 11,
    QTO: 1,
    VALOR_TOTAL: 11,
    NUM_FABRICANTE: "54715",
  },
  {
    COD_PRODUTO: 67997,
    DESC_PRODUTO: "ABRACADEIRA 44X57 PRESIL",
    VALOR: 9,
    QTO: 1,
    VALOR_TOTAL: 9,
    NUM_FABRICANTE: "4457-",
  },
  {
    COD_PRODUTO: 15889,
    DESC_PRODUTO: "ABRACADEIRA ACO 6X7MM",
    VALOR: 4,
    QTO: 1,
    VALOR_TOTAL: 4,
    NUM_FABRICANTE: "0115297",
  },
  {
    COD_PRODUTO: 15887,
    DESC_PRODUTO: "ABRACADEIRA ACO 7X8MM",
    VALOR: 4,
    QTO: 1,
    VALOR_TOTAL: 4,
    NUM_FABRICANTE: "0115298",
  },
  {
    COD_PRODUTO: 15888,
    DESC_PRODUTO: "ABRACADEIRA ACO 8X9MM",
    VALOR: 4,
    QTO: 1,
    VALOR_TOTAL: 4,
    NUM_FABRICANTE: "0115299",
  },
  {
    COD_PRODUTO: 15886,
    DESC_PRODUTO: "ABRACADEIRA ACO 9X11MM",
    VALOR: 4,
    QTO: 1,
    VALOR_TOTAL: 4,
    NUM_FABRICANTE: "0115301",
  },
  {
    COD_PRODUTO: 15881,
    DESC_PRODUTO: "ABRACADEIRA ACO 9X13MM",
    VALOR: 5,
    QTO: 1,
    VALOR_TOTAL: 5,
    NUM_FABRICANTE: "5691004",
  },
  {
    COD_PRODUTO: 48943,
    DESC_PRODUTO: "ABRACADEIRA ACO 11 A 20MM GALVANIZADO",
    VALOR: 5,
    QTO: 1,
    VALOR_TOTAL: 5,
    NUM_FABRICANTE: "5400455",
  },
  {
    COD_PRODUTO: 15885,
    DESC_PRODUTO: "ABRACADEIRA ACO 11X13MM",
    VALOR: 4,
    QTO: 1,
    VALOR_TOTAL: 4,
    NUM_FABRICANTE: "0115302",
  },
  {
    COD_PRODUTO: 15891,
    DESC_PRODUTO: "ABRACADEIRA ACO 12X14MM",
    VALOR: 4,
    QTO: 1,
    VALOR_TOTAL: 4,
    NUM_FABRICANTE: "0115303",
  },
  {
    COD_PRODUTO: 15880,
    DESC_PRODUTO: "ABRACADEIRA ACO 12X16MM",
    VALOR: 5,
    QTO: 1,
    VALOR_TOTAL: 5,
    NUM_FABRICANTE: "54702",
  },
  {
    COD_PRODUTO: 15890,
    DESC_PRODUTO: "ABRACADEIRA ACO 14X17MM",
    VALOR: 5,
    QTO: 1,
    VALOR_TOTAL: 5,
    NUM_FABRICANTE: "0115304",
  },
  {
    COD_PRODUTO: 15882,
    DESC_PRODUTO: "ABRACADEIRA ACO 14X22MM",
    VALOR: 2,
    QTO: 1,
    VALOR_TOTAL: 2,
    NUM_FABRICANTE: "5691010",
  },
  {
    COD_PRODUTO: 15879,
    DESC_PRODUTO: "ABRACADEIRA ACO 22X32MM",
    VALOR: 5,
    QTO: 1,
    VALOR_TOTAL: 5,
    NUM_FABRICANTE: "54710",
  },
  {
    COD_PRODUTO: 15878,
    DESC_PRODUTO: "ABRACADEIRA ACO 25X38MM",
    VALOR: 8,
    QTO: 1,
    VALOR_TOTAL: 8,
    NUM_FABRICANTE: "5691016",
  },
  {
    COD_PRODUTO: 15877,
    DESC_PRODUTO: "ABRACADEIRA ACO 38X51MM",
    VALOR: 8,
    QTO: 1,
    VALOR_TOTAL: 8,
    NUM_FABRICANTE: "5691019",
  },
  {
    COD_PRODUTO: 15875,
    DESC_PRODUTO: "ABRACADEIRA ACO 51X64MM",
    VALOR: 12,
    QTO: 1,
    VALOR_TOTAL: 12,
    NUM_FABRICANTE: "5701024",
  },
  {
    COD_PRODUTO: 15876,
    DESC_PRODUTO: "ABRACADEIRA ACO 51X64MM",
    VALOR: 10,
    QTO: 1,
    VALOR_TOTAL: 10,
    NUM_FABRICANTE: "5691023",
  },
  {
    COD_PRODUTO: 15732,
    DESC_PRODUTO: "ABRACADEIRA ACO 57X70MM",
    VALOR: 9,
    QTO: 1,
    VALOR_TOTAL: 9,
    NUM_FABRICANTE: "5701026",
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
          :items="testeVales"
          fixed-header
          height="190"
          class="d-flex flex-grow-1"
        ></v-data-table-virtual>
      </div>
      <div class="mt-2">
        <span class="spanColor">Peças Orcamento</span>
        <v-data-table-virtual
          :headers="headerTablePecasOrc"
          :items="testePecas"
          height="190"
          fixed-header
          class=""
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
