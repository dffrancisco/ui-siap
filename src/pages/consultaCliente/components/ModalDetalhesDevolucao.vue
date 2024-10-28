<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { iDetalhesDevolucao } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps<{
  detalhesDevolucao: iDetalhesDevolucao[] | null;
}>();

const emit = defineEmits(["closeModalDetalhesDevolucao"]);

const state = reactive({
  loading: false,
  detalhesDevolucao: <iDetalhesDevolucao[]>[],
  headers: <any>[
    { title: "Nº Fabricante", key: "NUM_FABRICANTE", align: "left" },
    { title: "Qtd.", key: "QUANTIDADE", align: "center" },
    {
      title: "Descrição Itens",
      key: "DESC_PRODUTO",
      align: "left",
    },
    {
      title: "Data",
      key: "DATA",
      align: "center",
      value: (item: any) => utils.dataBrasil(item.DATA),
    },
    {
      title: "Valor",
      key: "VENDA",
      align: "center",
      value: (item: any) => utils.formatValor(item.VENDA),
    },
  ],
});

onMounted(async () => {
  state.detalhesDevolucao = props.detalhesDevolucao;
});

const cancelar = () => {
  emit("closeModalDetalhesDevolucao");
};

const getClassCorLinha = (dados: any) => {
  let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
  return { class: classe };
};
</script>

<template>
  <v-card>
    <v-card-title class="py-3"> Itens Devolução </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="state.headers"
        :items="state.detalhesDevolucao"
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
