<script setup lang="ts">
import { computed, onMounted } from "vue";
import { actions, state } from "../modalhistoricoProduto";
import { dataBrasil, formatHora, formatValor } from "@/ts/utils";
import { iOrcamento, iOrcamentoItens } from "../interface";

const headers = [
  { title: "N° fabricante", align: "start", key: "NUM_FABRICANTE" },
  { title: "Descrição produto", align: "start", key: "DESC_PRODUTO" },
  { title: "Carro", align: "start", key: "CARRO" },
  { title: "End estoque", align: "start", key: "END_ESTOQUE" },
  { title: "Qtd", align: "center", key: "QTO" },
  { title: "Valor", align: "start", key: "VALOR" },
  { title: "Desconto", align: "start", key: "DESCONTO" },
  { title: "Subtotal", align: "start", key: "SUBTOTAL" },
];

const props = defineProps({
  orcamento: {
    type: Object as () => iOrcamento,
  },
  orcamentoItens: {
    type: Object as () => any,
  },
});
</script>
<template>
  <v-card
    class="bg-white border pa-2"
    style="min-width: 900px; width: 900px; margin: 0 auto"
  >
    <v-card-title class="titulo">Detalhes da venda</v-card-title>

    <v-card class="pa-1 mb-3 bg-grey-lighten-3">
      <v-container class="bg-grey-lighten-3 rounded-lg mb-1">
        <v-row>
          <v-col
            cols="3"
            class="constainer_informacao_orcamento rounded-ts-lg"
          >
            <label>N° orçamento: </label>
            <span class="font-weight-bold">{{ props.orcamento?.NUM_ORCAMENTO || "Não possui" }}</span>
          </v-col>
          <v-col
            cols="3"
            class="constainer_informacao_orcamento"
          >
            <label>Data da venda: </label>
            <span class="font-weight-bold">{{ dataBrasil(props.orcamento?.DATA) || "Não possui" }}</span>
          </v-col>
          <v-col
            cols="3"
            class="constainer_informacao_orcamento"
          >
            <label>Hora: </label>
            <span class="font-weight-bold">{{ formatHora(props.orcamento?.HORA) || "Não possui" }}</span>
          </v-col>
          <v-col
            cols="3"
            class="constainer_informacao_orcamento rounded-te-lg"
          >
            <label>Tipo de pagamento: </label>
            <span class="font-weight-bold">{{ props.orcamento?.TIPO_PAGAMENTO_FINAL || "Não possui" }}</span>
          </v-col>

          <v-col
            cols="6"
            class="constainer_informacao_orcamento"
          >
            <label>Nome / Cliente: </label>
            <span class="font-weight-bold"
              >{{ props.orcamento?.CLIENTE || "Não possui" }} /
              {{ props.orcamento?.NOME_CLIENTE || "Não possui" }}</span
            >
          </v-col>
          <v-col
            cols="3"
            class="constainer_informacao_orcamento"
          >
            <label>Caixa: </label>
            <span class="font-weight-bold">{{ props.orcamento?.CAIXA || "Não possui" }} </span>
          </v-col>
          <v-col
            cols="3"
            class="constainer_informacao_orcamento"
          >
            <label>Vendedor: </label>
            <span class="font-weight-bold">{{ props.orcamento?.VENDEDOR || "Não possui" }} </span>
          </v-col>

          <v-col
            cols="6"
            class="constainer_informacao_orcamento rounded-bs-lg"
          >
            <label>R$ Desconto: </label>
            <span class="font-weight-bold"> {{ formatValor(props.orcamento?.DESCONTO) || "Não possui" }} </span>
          </v-col>
          <v-col
            cols="3"
            class="constainer_informacao_orcamento"
          >
            <label>R$ Total: </label>
            <span class="font-weight-bold">{{ formatValor(props.orcamento?.VALOR) || "Não possui" }} </span>
          </v-col>
          <v-col class="constainer_informacao_orcamento rounded-be-lg">
            <label cols="3">Estoquista: </label>
            <span class="font-weight-bold">{{ props.orcamento?.ESTOQUISTA || "Não possui" }} </span>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-data-table-virtual
      class="elevation-2 primary"
      :header-props="{ class: 'bg-teal-lighten-5 border ' }"
      :headers="headers"
      :items="state.orcamentoItens"
      height="400"
      item-value="name"
      fixed-header
    >
      <template v-slot:item="{ item }">
        <tr class="bg-white">
          <td class="border">{{ item.NUM_FABRICANTE || "Não possui" }}</td>
          <td class="border">{{ item.DESC_PRODUTO || "Não possui" }}</td>
          <td class="border">{{ item.CARRO || "Não possui" }}</td>
          <td class="border">{{ item.END_ESTOQUE || "Não possui" }}</td>
          <td class="border text-center">{{ item.QTO || "Não possui" }}</td>
          <td class="border text-end">{{ formatValor(item.VALOR) || "Não possui" }}</td>
          <td class="border text-end">{{ formatValor(item.DESCONTO) || "Não possui" }}</td>
          <td class="border text-end">{{ formatValor(item.SUBTOTAL) || "Não possui" }}</td>
        </tr>
      </template>
    </v-data-table-virtual>
  </v-card>
</template>
<style scoped>
.constainer_informacao_orcamento {
  border: 1px solid #eeeeee;
  background: white;
}
.titulo {
  padding: 10px 0px 10px 0px;
}
</style>
