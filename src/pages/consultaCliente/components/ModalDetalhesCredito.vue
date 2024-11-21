<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { iDetalhesItensCredito, iDetalhesUsoCredito } from "../interfaces";
import utils from "@/ts/utils";

const props = defineProps<{
  detalhesUsoCredito: iDetalhesUsoCredito[] | null | undefined;
  detalhesItensCredito: iDetalhesItensCredito[] | null | undefined;
}>();

const emit = defineEmits(["closeModalDetalhesCredito"]);

const state = reactive({
  loading: false,
  detalhesUsoCredito: <iDetalhesUsoCredito[]>[],
  detalhesItensCredito: <iDetalhesItensCredito[]>[],
  tab: 0,
  headers1: <any>[
    { title: "Data", key: "DATA_DO_USO", align: "left", value: (item: any) => utils.dataBrasil(item.DATA_DO_USO) },
    {
      title: "Valor Crédito",
      key: "VALOR",
      align: "center",
      value: (item: any) => utils.formatValor(item.VALOR),
    },
    { title: "Loja", key: "LOJA", align: "left" },
    {
      title: "Local Uso Crédito",
      key: "NOME_USA_CREDITO",
      align: "center",
    },
  ],
  headers2: <any>[
    { title: "Nº Fabricante", key: "NUM_FABRICANTE", align: "left" },
    {
      title: "Produto",
      key: "DESC_PRODUTO",
      align: "left",
    },
    {
      title: "Carro",
      key: "DESCRICAO",
      align: "center",
    },
    {
      title: "Quantidade",
      key: "QUANTIDADE",
      align: "center",
    },
    {
      title: "Valor",
      key: "VENDA",
      align: "center",
      value: (item: any) => utils.formatValor(item.VALOR),
    },
  ],
});

onMounted(async () => {
  state.detalhesUsoCredito = props.detalhesUsoCredito;
  state.detalhesItensCredito = props.detalhesItensCredito;
});

const cancelar = () => {
  emit("closeModalDetalhesCredito");
};

const getClassCorLinha = (dados: any) => {
  let classe = dados.index % 2 == 0 ? "cor-zebrada-1" : "cor-zebrada-2";
  return { class: classe };
};
</script>

<template>
  <v-card>
    <v-card-title class="py-3"> Detalhes do Crédito </v-card-title>
    <v-card-text>
      <div class="d-flex justify-start mb-4">
        <v-btn
          variant="text"
          :color="state.tab === 0 ? 'primary' : 'default'"
          @click="state.tab = 0"
        >
          Uso do Crédito
        </v-btn>
        <v-btn
          variant="text"
          :color="state.tab === 1 ? 'primary' : 'default'"
          @click="state.tab = 1"
        >
          Item Devolvido
        </v-btn>
      </div>

      <v-window v-model="state.tab">
        <v-window-item value="0">
          <v-data-table
            :headers="state.headers1"
            :items="state.detalhesUsoCredito"
            items-per-page="5"
            fixed-header
            height="220"
            :row-props="getClassCorLinha"
            class="mb-1"
          ></v-data-table>
        </v-window-item>

        <v-window-item value="1">
          <v-data-table
            :headers="state.headers2"
            :items="state.detalhesItensCredito"
            items-per-page="5"
            fixed-header
            height="220"
            class="mb-1"
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
