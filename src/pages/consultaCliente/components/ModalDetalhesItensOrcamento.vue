<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { iDetalhesItensOrcamento } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps<{
  detalhesItens: iDetalhesItensOrcamento[] | null;
}>();

const emit = defineEmits(["closeModalDetalhesItensOrcamento"]);

const state = reactive({
  loading: false,
  detalhesItens: <iDetalhesItensOrcamento[]>[],
  headers: <any>[
    { title: "Quantidade", key: "QUANTIDADE", align: "left" },
    { title: "Nº Orçamento", key: "NUM_ORCAMENTO", align: "left" },
    {
      title: "Data",
      key: "DATA",
      align: "left",
      value: (item: any) => utils.dataBrasil(item.DATA),
    },
    { title: "Descrição Itens", key: "DESC_PRODUTO", align: "left" },
  ],
});

onMounted(async () => {
  state.detalhesItens = props.detalhesItens;
});

const cancelar = () => {
  emit("closeModalDetalhesItensOrcamento");
};

const getClassCorLinha = (dados: any) => {
  let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
  return { class: classe };
};
</script>

<template>
  <v-card>
    <v-card-title class="py-3"> Orçamento do Item</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="state.headers"
        :items="state.detalhesItens"
        fixed-header
        items-per-page-text="Itens por página"
        :row-props="getClassCorLinha"
        height="310"
      ></v-data-table
    ></v-card-text>

    <div class="d-flex justify-end pb-4 mr-4">
      <v-btn
        variant="outlined"
        color="primary"
        @click="cancelar"
        >Cancelar</v-btn
      >
    </div>
  </v-card>
</template>

<style scoped>
.cor-zebrada-1 {
  background-color: #f0f0f0;
}
</style>
