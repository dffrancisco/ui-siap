<script setup lang="ts">
import { nextTick, reactive, watch } from "vue";
import { iDetalhesDevolucao } from "../interfaces";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";

const props = defineProps<{
  devolucaoSelecionada: iDetalhesDevolucao[];
  modalOpened: boolean;
}>();

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.gridDetalhesItensDevolucao.source(props.devolucaoSelecionada);
    }
  }
);

const state = reactive({
  gridDetalhesItensDevolucao: <ixGridCreate>{},
});

const actions = {
  criarGrid() {
    state.gridDetalhesItensDevolucao = new xGridV2.create({
      el: "#gridDetalhesItensDevolucao",
      width: 850,
      height: 300,
      count: false,
      columns: {
        Produto: {
          dataField: "DESC_PRODUTO",
          center: true,
          width: "30%",
        },
        Motivo: {
          dataField: "MOTIVO_DEVOLUCAO",
          center: true,
          width: "30%",
        },
        Observação: {
          dataField: "QUAL_TIPO_AVARIA",
          center: true,
          width: "28%",
        },
        "Crédito Restante": {
          dataField: "CREDITO",
          center: true,
          render: utils.formatValor,
          width: "12%",
        },
      },
    });
  },
};

nextTick(() => {
  actions.criarGrid();
});
</script>

<template>
  <v-container>
    <div>
      <div id="gridDetalhesItensDevolucao"></div>
    </div>
  </v-container>
</template>

<style scoped></style>
