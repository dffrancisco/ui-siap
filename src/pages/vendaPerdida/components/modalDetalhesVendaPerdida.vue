<script setup lang="ts">
import { nextTick, reactive, watch, computed } from "vue";
import { iGetVendasPerdidasResponse } from "../interfaces";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import moment from "moment";

const props = defineProps<{
  vendaPerdidaDetalhada: iGetVendasPerdidasResponse;
  modalOpened: boolean;
}>();

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.gridDetalhesVendaPerdida.source(vendaPerdidaDetalhadaArray.value);
    }
  }
);

const state = reactive({
  gridDetalhesVendaPerdida: <ixGridCreate>{},
});

const vendaPerdidaDetalhadaArray = computed(() => {
  const detalhe = props.vendaPerdidaDetalhada;
  const arrayDeObjetos = detalhe.DATA?.map((data, index) => ({
    COD_PRODUTO: detalhe.COD_PRODUTO,
    NUM_FABRICANTE: detalhe.NUM_FABRICANTE,
    NUM_FABRICANTE2: detalhe.NUM_FABRICANTE2,
    QUANTIDADE: detalhe.QUANTIDADE,
    DESC_PRODUTO: detalhe.DESC_PRODUTO,
    DESC_PRODUTO_COMPLETA: detalhe.DESC_PRODUTO_COMPLETA,
    ID_MARCA: detalhe.ID_MARCA,
    DESC_MARCA: detalhe.DESC_MARCA,
    QUANTIDADE_PERDIDA: detalhe.QUANTIDADE_PERDIDA,
    DATA: data,
    HORA: detalhe.HORA[index],
    COD_FUNCIONARIO: detalhe.COD_FUNCIONARIO[index],
    NOME_COMP: detalhe.NOME_COMP[index],
    LOGIN: detalhe.LOGIN[index],
  }));
  return arrayDeObjetos;
});

function formatarHora(hora) {
  if (hora) {
    return moment(hora).format("HH:mm");
  }

  return null;
}

const actions = {
  criarGrid() {
    state.gridDetalhesVendaPerdida = new xGridV2.create({
      el: "#gridDetalhesVendaPerdida",
      width: 750,
      height: 300,
      count: false,
      columns: {
        "Cod. Produto": {
          dataField: "COD_PRODUTO",
          width: "10%",
        },
        Data: {
          dataField: "DATA",
          render: utils.dataBrasil,
          width: "10%",
        },
        Descrição: {
          dataField: "DESC_PRODUTO",
          width: "40%",
        },
        Marca: {
          dataField: "DESC_MARCA",
        },
        Hora: {
          dataField: "HORA",
          render: formatarHora,
          width: "10%",
        },
        Funcionario: {
          dataField: "LOGIN",
          width: "20%",
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
      <div id="gridDetalhesVendaPerdida"></div>
    </div>
  </v-container>
</template>

<style scoped></style>
