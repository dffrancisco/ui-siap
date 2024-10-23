<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { iDetalhesItensMarca } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps<{
  detalhesItensMarca: iDetalhesItensMarca[] | null;
}>();

const emit = defineEmits(["closeModalDetalhesItensMarca"]);

const state = reactive({
  loading: false,
  detalhesItensMarca: <iDetalhesItensMarca[]>[],
  headers: <any>[
    { title: "Produto", key: "DESC_PRODUTO", align: "left" },
    { title: "Quantidade", key: "QUANTIDADE", align: "center" },
    {
      title: "Nº Orçamento",
      key: "NUM_ORCAMENTO",
      align: "center",
    },
    {
      title: "Data",
      key: "DATA",
      align: "center",
      value: (item: any) => utils.dataBrasil(item.DATA),
    },
  ],
});

onMounted(async () => {
  state.detalhesItensMarca = props.detalhesItensMarca;
});

const cancelar = () => {
  emit("closeModalDetalhesItensMarca");
};

const getClassCorLinha = (dados: any) => {
  let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
  return { class: classe };
};
</script>

<template>
  <v-card>
    <v-card-title class="py-3"> Itens Comprados por Marca </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="state.headers"
        :items="state.detalhesItensMarca"
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
