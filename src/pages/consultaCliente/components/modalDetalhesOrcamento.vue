<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { iDetalhesItensOrc, iDetalhesMontagemOrc } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps<{
  detalhesItensOrcamento: iDetalhesItensOrc[] | null | undefined;
  detalhesMontagem: iDetalhesMontagemOrc[] | null | undefined;
}>();

const emit = defineEmits(["closeModalDetalhesOrcamento"]);

const state = reactive({
  loading: false,
  detalhesItensOrcamento: <iDetalhesItensOrc[]>[],
  detalhesMontagem: <iDetalhesMontagemOrc[]>[],
  tab: 0,
  headers1: <any>[
    { title: "Nº Fabricante", key: "NUM_FABRICANTE", align: "left" },
    {
      title: "Descrição Peça",
      key: "DESC_PRODUTO",
      align: "left",
    },
    {
      title: "Quantidade",
      key: "QTO",
      align: "center",
    },
    {
      title: "Valor",
      key: "VALOR",
      align: "center",
      value: (item: any) => utils.formatValor(item.VALOR),
    },
    {
      title: "Sub Total",
      key: "SUBTOTAL",
      align: "center",
      value: (item: any) => utils.formatValor(item.SUBTOTAL),
    },
  ],
  headers2: <any>[
    { title: "Descrição Montagem", key: "DESC_MONTAGEN", align: "left" },
    {
      title: "Carro",
      key: "CARRO",
      align: "left",
    },
    {
      title: "Modelo",
      key: "MODELO",
      align: "center",
    },
    {
      title: "Placa",
      key: "PLACA",
      align: "center",
    },
    {
      title: "Valor",
      key: "VALOR",
      align: "center",
      value: (item: any) => utils.formatValor(item.VALOR),
    },
    {
      title: "Data",
      key: "DATA",
      align: "center",
      value: (item: any) => utils.dataBrasil(item.DATA),
    },
    {
      title: "Montador",
      key: "MONTADOR",
      align: "center",
    },
  ],
});

onMounted(async () => {
  state.detalhesItensOrcamento = props.detalhesItensOrcamento;
  state.detalhesMontagem = props.detalhesMontagem;
});

const cancelar = () => {
  emit("closeModalDetalhesOrcamento");
};

const getClassCorLinha = (dados: any) => {
  let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
  return { class: classe };
};
</script>

<template>
  <v-card>
    <v-card-title class="py-3"> Detalhes do Orçamento </v-card-title>
    <v-card-text>
      <div class="d-flex justify-start mb-4">
        <v-btn
          variant="text"
          :color="state.tab === 0 ? 'primary' : 'default'"
          @click="state.tab = 0"
        >
          Itens do Orçamento
        </v-btn>
        <v-btn
          variant="text"
          :color="state.tab === 1 ? 'primary' : 'default'"
          @click="state.tab = 1"
        >
          Montagem do Orçamento
        </v-btn>
      </div>

      <v-window v-model="state.tab">
        <!-- Itens do Orçamento -->
        <v-window-item value="0">
          <v-data-table
            :headers="state.headers1"
            :items="state.detalhesItensOrcamento"
            items-per-page="5"
            :row-props="getClassCorLinha"
            class="mb-4"
          ></v-data-table>
        </v-window-item>

        <!-- Montagem do Orçamento -->
        <v-window-item value="1">
          <v-data-table
            :headers="state.headers2"
            :items="state.detalhesMontagem"
            items-per-page="5"
            :row-props="getClassCorLinha"
          ></v-data-table>
        </v-window-item>
      </v-window>
    </v-card-text>

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
