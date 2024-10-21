<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { iBoletosAtrasados } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps<{
  boletosAtrasados: iBoletosAtrasados[] | null;
}>();

const emit = defineEmits(["closeModalBoletosAtrasados"]);

const state = reactive({
  loading: false,
  boletosAtrasados: <iBoletosAtrasados[]>[],
  headers: <any>[
    { title: "Nº Boleto", key: "NUM_BOLETO", align: "left" },
    { title: "Valor", key: "VALOR", align: "left", value: (item: any) => utils.formatValor(item.VALOR) },
    {
      title: "Data Processamento",
      key: "DATA_PROCESSAMENTO",
      align: "center",
      value: (item: any) => utils.dataBrasil(item.DATA_PROCESSAMENTO),
    },
    {
      title: "Data Vencimento",
      key: "DATA_VENCIMENTO",
      align: "center",
      value: (item: any) => utils.dataBrasil(item.DATA_VENCIMENTO),
    },
    {
      title: "Data Quitação",
      key: "DATA_QUITACAO",
      align: "center",
      value: (item: any) => utils.dataBrasil(item.DATA_QUITACAO),
    },
    { title: "Divisão", key: "DIVISAO", align: "center" },
  ],
});

onMounted(async () => {
  state.boletosAtrasados = props.boletosAtrasados;
});

const cancelar = () => {
  emit("closeModalBoletosAtrasados");
};

const getClassCorLinha = (dados: any) => {
  let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
  return { class: classe };
};
</script>

<template>
  <v-card>
    <v-card-title class="py-3"> Boletos Atrasados </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="state.headers"
        :items="state.boletosAtrasados"
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
