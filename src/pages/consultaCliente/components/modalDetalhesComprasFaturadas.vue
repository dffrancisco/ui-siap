<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { iBoletosComprasFaturadas } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps<{
  detalhesComprasFaturadas: iBoletosComprasFaturadas[] | null;
}>();

const emit = defineEmits(["closeModalDetalhesComprasFaturadas"]);

const state = reactive({
  loading: false,
  detalhesComprasFaturadas: <iBoletosComprasFaturadas[]>[],
  headers: <any>[
    { title: "Número do Boleto", key: "NUM_BOLETO", align: "left" },
    { title: "Valor", key: "VALOR", align: "left", value: (item: any) => utils.formatValor(item.VALOR) },
    {
      title: "Data do Processamento",
      key: "DATA_PROCESSAMENTO",
      align: "left",
      value: (item: any) => utils.dataBrasil(item.DATA_PROCESSAMENTO),
    },
    {
      title: "Data do Vencimento",
      key: "DATA_VENCIMENTO",
      align: "left",
      value: (item: any) => utils.dataBrasil(item.DATA_VENCIMENTO),
    },
    {
      title: "Data da Quitação",
      key: "DATA_QUITACAO",
      align: "left",
      value: (item: any) => utils.dataBrasil(item.DATA_QUITACAO),
    },
    { title: "Divisão", key: "DIVISAO", align: "left" },
  ],
});

onMounted(async () => {
  state.detalhesComprasFaturadas = props.detalhesComprasFaturadas;
});

const cancelar = () => {
  emit("closeModalDetalhesComprasFaturadas");
};

const getClassCorLinha = (dados: any) => {
  let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
  return { class: classe };
};
</script>

<template>
  <v-card>
    <v-card-title class="py-3"> Informações do Boleto </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="state.headers"
        :items="state.detalhesComprasFaturadas"
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
