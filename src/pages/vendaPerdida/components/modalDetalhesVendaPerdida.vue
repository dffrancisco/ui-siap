<script setup lang="ts">
import { nextTick, reactive, watch } from "vue";
import { iGetDetalhesResponse } from "../interfaces";
import xGridV2, { ixGridCreate } from "@/plugins/xGridV2";
import utils from "@/ts/utils";
import moment from "moment";

const props = defineProps<{
  vendaPerdidaDetalhada: iGetDetalhesResponse[];
  modalOpened: boolean;
}>();

watch(
  () => props.modalOpened,
  () => {
    if (props.modalOpened) {
      state.gridDetalhesVendaPerdida.source(props.vendaPerdidaDetalhada);
    }
  }
);

const state = reactive({
  gridDetalhesVendaPerdida: <ixGridCreate>{},
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
          center: true,
        },
        Data: {
          dataField: "DATA",
          render: utils.dataBrasil,
          center: true,
        },
        Hora: {
          dataField: "HORA",
          render: formatarHora,
          center: true,
        },
        Funcionario: {
          dataField: "LOGIN",
          center: true,
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
